import { useState } from 'react';
import type { SaveData, EquipmentInstance } from '../../types';
import { EQUIPMENT_DATA, getEquipmentById, ENHANCE_COSTS, ENHANCE_MULTIPLIERS, MATERIAL_SHOP, MATERIALS } from '../../data/equipment';
import { getCraftRecipes } from '../../data/crafting';
import { CHARACTERS } from '../../data/characters';
import { seBuy } from '../../systems/sound';

// 装備をソートするヘルパー: type(weapon→accessory) → weaponType → shopPrice
function sortEquipInstances(insts: EquipmentInstance[]): EquipmentInstance[] {
  const TYPE_ORDER: Record<string, number> = { sword: 0, staff: 1, bow: 2, shield: 3, holy: 4, instrument: 5, cursed: 6 };
  return [...insts].sort((a, b) => {
    const da = getEquipmentById(a.itemId);
    const db = getEquipmentById(b.itemId);
    if (!da || !db) return 0;
    // weapon before accessory
    const typeA = da.type === 'weapon' ? 0 : 1;
    const typeB = db.type === 'weapon' ? 0 : 1;
    if (typeA !== typeB) return typeA - typeB;
    // weapon type order
    const wtA = da.weaponType ? (TYPE_ORDER[da.weaponType] ?? 99) : 99;
    const wtB = db.weaponType ? (TYPE_ORDER[db.weaponType] ?? 99) : 99;
    if (wtA !== wtB) return wtA - wtB;
    // shop price descending (better items first, drop-only treated as high value)
    const priceA = da.shopPrice > 0 ? da.shopPrice : 99999;
    const priceB = db.shopPrice > 0 ? db.shopPrice : 99999;
    return priceB - priceA;
  });
}

interface ShopScreenProps {
  saveData: SaveData;
  onUpdate: (next: SaveData) => void;
  onBack: () => void;
}

type ShopTab = 'buy' | 'material' | 'sell' | 'enhance' | 'craft';

export function ShopScreen({ saveData, onUpdate, onBack }: ShopScreenProps) {
  const [tab, setTab] = useState<ShopTab>('buy');
  const [selectedEquipId, setSelectedEquipId] = useState<string | null>(null);
  const [sellConfirm, setSellConfirm] = useState<string | null>(null); // instanceId

  const { gil, equipments } = saveData.progress.inventory;

  // 装着中のinstanceIdセット（売却不可チェック用）＆装備者マップ
  const equippedInstanceIds = new Set<string>();
  const instanceToEquipper = new Map<string, string>(); // instanceId → charId
  for (const char of saveData.player.roster) {
    const eq = char.equipment;
    [eq.weapon, eq.accessory1, eq.accessory2, eq.accessory3, eq.accessory4]
      .filter(Boolean).forEach(id => {
        equippedInstanceIds.add(id!);
        instanceToEquipper.set(id!, char.id);
      });
  }

  function calcSellPrice(shopPrice: number, enhanceLevel: number): number {
    const base = shopPrice > 5000 ? Math.floor(shopPrice * 0.10) : Math.floor(shopPrice * 0.50);
    // 強化レベル分の価値を少し加算
    return base + enhanceLevel * Math.floor(base * 0.05);
  }

  function sellEquipment(instanceId: string) {
    const inst = equipments.find(e => e.instanceId === instanceId);
    if (!inst || equippedInstanceIds.has(instanceId)) return;
    const data = getEquipmentById(inst.itemId);
    if (!data) return;
    const price = calcSellPrice(data.shopPrice, inst.enhanceLevel);
    onUpdate({
      ...saveData,
      progress: {
        ...saveData.progress,
        inventory: {
          ...saveData.progress.inventory,
          gil: gil + price,
          equipments: equipments.filter(e => e.instanceId !== instanceId),
        },
      },
    });
  }
  const clearedStages = saveData.progress.clearedStages;
  const maxStage = clearedStages.length > 0 ? Math.max(...clearedStages) : 0;

  const availableItems = EQUIPMENT_DATA.filter(e => e.shopPrice > 0 && e.unlockStage <= maxStage);

  // 購入可能な素材リスト
  const availableMaterials = MATERIAL_SHOP.filter(entry => {
    if (entry.minCleared === 0) return true;
    return maxStage >= entry.minCleared;
  });

  function buyMaterial(itemId: string, price: number) {
    if (gil < price) return;
    seBuy();
    const newMaterials = [...saveData.progress.inventory.materials];
    const existing = newMaterials.find(m => m.itemId === itemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      newMaterials.push({ itemId, quantity: 1 });
    }
    onUpdate({
      ...saveData,
      progress: {
        ...saveData.progress,
        inventory: {
          ...saveData.progress.inventory,
          gil: gil - price,
          materials: newMaterials,
        },
      },
    });
  }

  function buyEquipment(itemId: string) {
    const item = getEquipmentById(itemId);
    if (!item || item.shopPrice > gil) return;
    seBuy();

    const newInstance: EquipmentInstance = {
      instanceId: `${itemId}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      itemId,
      enhanceLevel: 0,
    };

    onUpdate({
      ...saveData,
      progress: {
        ...saveData.progress,
        inventory: {
          ...saveData.progress.inventory,
          gil: gil - item.shopPrice,
          equipments: [...equipments, newInstance],
        },
      },
    });
  }

  return (
    <div className="shop-screen">
      <div className="shop-header">
        <button className="btn-back" onClick={onBack}>← 戻る</button>
        <h2>ショップ</h2>
        <span className="gil-display">💰 {gil.toLocaleString()}</span>
      </div>

      <div className="shop-tabs">
        <button className={tab === 'buy' ? 'active' : ''} onClick={() => setTab('buy')}>装備購入</button>
        <button className={tab === 'material' ? 'active' : ''} onClick={() => setTab('material')}>素材購入</button>
        <button className={tab === 'sell' ? 'active' : ''} onClick={() => setTab('sell')}>売却</button>
        <button className={tab === 'enhance' ? 'active' : ''} onClick={() => setTab('enhance')}>装備強化</button>
        <button className={tab === 'craft' ? 'active' : ''} onClick={() => setTab('craft')}>⚗️合成</button>
      </div>

      {tab === 'buy' && (
        <div className="shop-items">
          {availableItems.length === 0 && (
            <p className="no-items">ステージをクリアして品揃えを増やそう！</p>
          )}
          {availableItems.map(item => {
            const canBuy = gil >= item.shopPrice;
            return (
              <div key={item.id} className="shop-item">
                <div className="shop-item-info">
                  <span className="item-emoji">{item.emoji}</span>
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-type">{item.type === 'weapon' ? '武器' : 'アクセサリ'}</span>
                    <span className="item-stats">
                      {Object.entries(item.baseStats).map(([k, v]) =>
                        v ? `${k.toUpperCase()}+${v}` : null
                      ).filter(Boolean).join(' / ')}
                      {item.effects.map((e) => {
                        if (e.type === 'atb_expand') return ' / ATB+1';
                        if (e.type === 'atb_speed') return ` / 速度+${Math.round(e.value * 100)}%`;
                        if (e.type === 'heal_boost') return ` / 回復+${Math.round(e.value * 100)}%`;
                        if (e.type === 'chain_boost') return ` / チェーン+${Math.round(e.value * 100)}%`;
                        return null;
                      }).filter(Boolean).join('')}
                    </span>
                  </div>
                </div>
                <button
                  className={`btn-buy ${canBuy ? '' : 'disabled'}`}
                  onClick={() => buyEquipment(item.id)}
                  disabled={!canBuy}
                >
                  💰{item.shopPrice.toLocaleString()}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'material' && (
        <div className="shop-items">
          {availableMaterials.length === 0 && (
            <p className="no-items">ステージをクリアして素材を入荷しよう！</p>
          )}
          {availableMaterials.map(entry => {
            const mat = MATERIALS.find(m => m.id === entry.itemId);
            if (!mat) return null;
            const owned = saveData.progress.inventory.materials.find(m => m.itemId === entry.itemId)?.quantity ?? 0;
            const canBuy = gil >= entry.price;
            return (
              <div key={entry.itemId} className={`shop-item ${entry.isRare ? 'rare-item' : ''}`}>
                <div className="shop-item-info">
                  <span className="item-emoji">{mat.emoji}</span>
                  <div className="item-details">
                    <span className="item-name">
                      {mat.name}
                      {entry.isRare && <span className="rare-badge"> ★レア</span>}
                    </span>
                    <span className="item-stats">{mat.description}</span>
                    <span className="item-owned">所持: {owned}個</span>
                  </div>
                </div>
                <button
                  className={`btn-buy ${canBuy ? '' : 'disabled'}`}
                  onClick={() => buyMaterial(entry.itemId, entry.price)}
                  disabled={!canBuy}
                >
                  💰{entry.price.toLocaleString()}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'sell' && (
        <div className="shop-items">
          {equipments.length === 0 && <p className="no-items">売却できる装備がありません</p>}
          {sortEquipInstances(equipments).map(inst => {
            const data = getEquipmentById(inst.itemId);
            if (!data) return null;
            const isEquipped = equippedInstanceIds.has(inst.instanceId);
            const price = calcSellPrice(data.shopPrice, inst.enhanceLevel);
            return (
              <div key={inst.instanceId} className={`shop-item ${isEquipped ? 'equipped-item' : ''}`}>
                <div className="shop-item-info">
                  <span className="item-emoji">{data.emoji}</span>
                  <div className="item-details">
                    <span className="item-name">
                      {data.name} {inst.enhanceLevel > 0 ? `+${inst.enhanceLevel}` : ''}
                      {isEquipped && <span className="equipped-badge"> 装備中</span>}
                    </span>
                    <span className="item-type">{data.type === 'weapon' ? '武器' : 'アクセサリ'}</span>
                    <span className="item-stats">売値: 💰{price.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  className={`btn-sell ${isEquipped ? 'disabled' : ''}`}
                  onClick={() => !isEquipped && setSellConfirm(inst.instanceId)}
                  disabled={isEquipped}
                >
                  売却
                </button>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'enhance' && (
        <div className="shop-items">
          {equipments.length === 0 && <p className="no-items">装備を購入してください</p>}
          {sortEquipInstances(equipments).map(inst => {
            const data = getEquipmentById(inst.itemId);
            if (!data) return null;
            const isSelected = inst.instanceId === selectedEquipId;
            const lv = inst.enhanceLevel;
            const cost = lv < 5 ? ENHANCE_COSTS[lv] : null;
            const matQty = cost
              ? (saveData.progress.inventory.materials.find(m => m.itemId === cost.material.itemId)?.quantity ?? 0)
              : 0;
            const canEnhance = !!cost && gil >= cost.gil && matQty >= cost.material.quantity;
            const nextMult = cost ? ENHANCE_MULTIPLIERS[lv + 1] : null;
            return (
              <div
                key={inst.instanceId}
                className={`shop-item enhance-inline-item ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedEquipId(isSelected ? null : inst.instanceId)}
              >
                <div className="shop-item-info">
                  <span className="item-emoji">{data.emoji}</span>
                  <div className="item-details">
                    <span className="item-name">{data.name}</span>
                    <span className="enhance-level-badge">+{lv}{lv >= 5 && ' MAX'}</span>
                  </div>
                  {(() => {
                    const equipper = instanceToEquipper.get(inst.instanceId);
                    const char = equipper ? CHARACTERS.find(c => c.id === equipper) : null;
                    return char ? (
                      <span className="enhance-equippedby">{char.emoji} {char.name}</span>
                    ) : null;
                  })()}
                </div>
                {isSelected && (
                  <div className="enhance-inline-panel" onClick={e => e.stopPropagation()}>
                    {lv < 5 && cost && nextMult ? (
                      <>
                        <span className="enhance-inline-preview">→ ×{nextMult.toFixed(2)}</span>
                        <span className="enhance-inline-cost">
                          💰{cost.gil.toLocaleString()} / {(MATERIALS.find(m => m.id === cost.material.itemId)?.name ?? cost.material.itemId.replace(/_/g, ' '))}×{cost.material.quantity}(所持:{matQty})
                        </span>
                        <button
                          className="btn-small btn-enhance-inline"
                          onClick={() => {
                            if (!canEnhance) return;
                            const newEquipments = equipments.map(e =>
                              e.instanceId !== inst.instanceId ? e : { ...e, enhanceLevel: e.enhanceLevel + 1 }
                            );
                            const newMats = saveData.progress.inventory.materials.map(m =>
                              m.itemId !== cost.material.itemId ? m : { ...m, quantity: m.quantity - cost.material.quantity }
                            ).filter(m => m.quantity > 0);
                            onUpdate({
                              ...saveData,
                              progress: {
                                ...saveData.progress,
                                inventory: { ...saveData.progress.inventory, gil: gil - cost.gil, equipments: newEquipments, materials: newMats },
                              },
                            });
                          }}
                          disabled={!canEnhance}
                        >
                          強化
                        </button>
                      </>
                    ) : (
                      <span className="max-badge">最大強化済み</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── 合成タブ ── */}
      {tab === 'craft' && (() => {
        const { materials } = saveData.progress.inventory;
        const recipes = getCraftRecipes(maxStage);

        function getMaterialQty(itemId: string) {
          return materials.find(m => m.itemId === itemId)?.quantity ?? 0;
        }
        function getMaterialEmoji(itemId: string) {
          return MATERIALS.find(m => m.id === itemId)?.emoji ?? '📦';
        }
        function getMaterialName(itemId: string) {
          return MATERIALS.find(m => m.id === itemId)?.name ?? itemId;
        }

        function canCraft(recipeId: string): boolean {
          const recipe = recipes.find(r => r.id === recipeId);
          if (!recipe) return false;
          return recipe.materials.every(m => getMaterialQty(m.itemId) >= m.quantity);
        }

        function handleCraft(recipeId: string) {
          const recipe = recipes.find(r => r.id === recipeId);
          if (!recipe || !canCraft(recipeId)) return;

          // 素材を消費
          let newMats = [...materials];
          for (const mat of recipe.materials) {
            newMats = newMats.map(m =>
              m.itemId !== mat.itemId ? m : { ...m, quantity: m.quantity - mat.quantity }
            ).filter(m => m.quantity > 0);
          }

          let newEquipments = [...equipments];
          if (recipe.resultType === 'equipment') {
            const newInst: EquipmentInstance = {
              instanceId: `${recipe.resultItemId}_craft_${Date.now()}_${Math.random().toString(36).slice(2)}`,
              itemId: recipe.resultItemId,
              enhanceLevel: 0,
            };
            newEquipments = [...newEquipments, newInst];
          } else {
            // material
            const existing = newMats.find(m => m.itemId === recipe.resultItemId);
            if (existing) {
              newMats = newMats.map(m =>
                m.itemId !== recipe.resultItemId ? m : { ...m, quantity: m.quantity + recipe.resultQuantity }
              );
            } else {
              newMats.push({ itemId: recipe.resultItemId, quantity: recipe.resultQuantity });
            }
          }

          onUpdate({
            ...saveData,
            progress: {
              ...saveData.progress,
              inventory: { ...saveData.progress.inventory, materials: newMats, equipments: newEquipments },
            },
          });
        }

        if (recipes.length === 0) {
          return (
            <div className="shop-items">
              <p className="no-items">ステージをクリアして合成レシピを解放しよう！</p>
            </div>
          );
        }

        return (
          <div className="shop-items craft-list">
            {recipes.map(recipe => {
              const craftable = canCraft(recipe.id);
              const resultData = recipe.resultType === 'equipment'
                ? getEquipmentById(recipe.resultItemId)
                : null;
              const resultMat = recipe.resultType === 'material'
                ? MATERIALS.find(m => m.id === recipe.resultItemId)
                : null;

              return (
                <div key={recipe.id} className={`craft-card ${craftable ? 'craftable' : ''}`}>
                  <div className="craft-result">
                    <span className="craft-result-emoji">
                      {resultData?.emoji ?? resultMat?.emoji ?? '📦'}
                    </span>
                    <div className="craft-result-info">
                      <span className="craft-result-name">{recipe.name}</span>
                      <span className="craft-result-desc">{recipe.description}</span>
                      {recipe.resultType === 'equipment' && resultData && (
                        <span className="craft-result-stats">
                          {resultData.baseStats.str ? `STR+${resultData.baseStats.str} ` : ''}
                          {resultData.baseStats.mag ? `MAG+${resultData.baseStats.mag} ` : ''}
                          {resultData.baseStats.hp  ? `HP+${resultData.baseStats.hp}` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="craft-materials">
                    {recipe.materials.map(mat => {
                      const have = getMaterialQty(mat.itemId);
                      const ok = have >= mat.quantity;
                      return (
                        <span key={mat.itemId} className={`craft-mat-item ${ok ? '' : 'shortage'}`}>
                          {getMaterialEmoji(mat.itemId)} {getMaterialName(mat.itemId)} ×{mat.quantity}
                          <span className="craft-mat-owned">（{have}）</span>
                        </span>
                      );
                    })}
                  </div>
                  <button
                    className={`btn-craft ${craftable ? '' : 'disabled'}`}
                    onClick={() => handleCraft(recipe.id)}
                    disabled={!craftable}
                  >
                    {craftable ? '⚗️ 合成' : '素材不足'}
                  </button>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* 売却確認モーダル */}
      {sellConfirm && (() => {
        const inst = equipments.find(e => e.instanceId === sellConfirm);
        const data = inst ? getEquipmentById(inst.itemId) : null;
        if (!inst || !data) return null;
        const price = calcSellPrice(data.shopPrice, inst.enhanceLevel);
        return (
          <div className="sell-confirm-overlay" onClick={() => setSellConfirm(null)}>
            <div className="sell-confirm-modal" onClick={e => e.stopPropagation()}>
              <div className="sell-confirm-item">
                <span className="sell-confirm-emoji">{data.emoji}</span>
                <span className="sell-confirm-name">
                  {data.name}{inst.enhanceLevel > 0 ? ` +${inst.enhanceLevel}` : ''}
                </span>
              </div>
              <div className="sell-confirm-price">💰 {price.toLocaleString()} Gil で売却しますか？</div>
              <div className="sell-confirm-btns">
                <button className="btn-sell-confirm" onClick={() => { sellEquipment(sellConfirm); setSellConfirm(null); }}>
                  確定
                </button>
                <button className="btn-secondary" onClick={() => setSellConfirm(null)}>
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
