import { useState } from 'react';
import type { SaveData, EquipmentInstance } from '../../types';
import { EQUIPMENT_DATA, getEquipmentById, ENHANCE_COSTS, ENHANCE_MULTIPLIERS, MATERIAL_SHOP, MATERIALS } from '../../data/equipment';

interface ShopScreenProps {
  saveData: SaveData;
  onUpdate: (next: SaveData) => void;
  onBack: () => void;
}

type ShopTab = 'buy' | 'material' | 'enhance';

export function ShopScreen({ saveData, onUpdate, onBack }: ShopScreenProps) {
  const [tab, setTab] = useState<ShopTab>('buy');
  const [selectedEquipId, setSelectedEquipId] = useState<string | null>(null);

  const { gil, equipments } = saveData.progress.inventory;
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

  const selectedInstance = selectedEquipId
    ? equipments.find(e => e.instanceId === selectedEquipId)
    : null;
  const selectedItemData = selectedInstance ? getEquipmentById(selectedInstance.itemId) : null;

  function enhanceEquipment() {
    if (!selectedInstance || !selectedItemData) return;
    const lv = selectedInstance.enhanceLevel;
    if (lv >= 5) return;

    const cost = ENHANCE_COSTS[lv];
    if (!cost) return;

    const materials = saveData.progress.inventory.materials;
    const matQty = materials.find(m => m.itemId === cost.material.itemId)?.quantity ?? 0;
    if (gil < cost.gil || matQty < cost.material.quantity) return;

    const newEquipments = equipments.map(e => {
      if (e.instanceId !== selectedInstance.instanceId) return e;
      return { ...e, enhanceLevel: e.enhanceLevel + 1 };
    });

    const newMats = materials.map(m => {
      if (m.itemId !== cost.material.itemId) return m;
      return { ...m, quantity: m.quantity - cost.material.quantity };
    }).filter(m => m.quantity > 0);

    onUpdate({
      ...saveData,
      progress: {
        ...saveData.progress,
        inventory: {
          ...saveData.progress.inventory,
          gil: gil - cost.gil,
          equipments: newEquipments,
          materials: newMats,
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
        <button className={tab === 'enhance' ? 'active' : ''} onClick={() => setTab('enhance')}>装備強化</button>
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

      {tab === 'enhance' && (
        <div className="enhance-tab">
          <div className="inventory-list">
            <h3>所持装備</h3>
            {equipments.length === 0 && <p className="no-items">装備を購入してください</p>}
            {equipments.map(inst => {
              const data = getEquipmentById(inst.itemId);
              if (!data) return null;
              return (
                <div
                  key={inst.instanceId}
                  className={`inventory-item ${inst.instanceId === selectedEquipId ? 'selected' : ''}`}
                  onClick={() => setSelectedEquipId(
                    inst.instanceId === selectedEquipId ? null : inst.instanceId
                  )}
                >
                  <span>{data.emoji} {data.name}</span>
                  <span className="enhance-level">+{inst.enhanceLevel}</span>
                </div>
              );
            })}
          </div>

          {selectedInstance && selectedItemData && (
            <div className="enhance-panel">
              <h3>{selectedItemData.emoji} {selectedItemData.name} [+{selectedInstance.enhanceLevel}]</h3>
              {selectedInstance.enhanceLevel < 5 ? (() => {
                const lv = selectedInstance.enhanceLevel;
                const cost = ENHANCE_COSTS[lv];
                if (!cost) return null;
                const matQty = saveData.progress.inventory.materials.find(
                  m => m.itemId === cost.material.itemId
                )?.quantity ?? 0;
                const canEnhance = gil >= cost.gil && matQty >= cost.material.quantity;
                const nextMult = ENHANCE_MULTIPLIERS[lv + 1];
                return (
                  <div className="enhance-detail">
                    <div className="enhance-preview">
                      強化後ステータス倍率: ×{nextMult.toFixed(2)}
                    </div>
                    <div className="enhance-cost">
                      <span>💰{cost.gil.toLocaleString()} Gil</span>
                      <span>
                        {cost.material.itemId.replace(/_/g, ' ')} ×{cost.material.quantity}
                        （所持: {matQty}）
                      </span>
                    </div>
                    <button
                      className="btn-primary"
                      onClick={enhanceEquipment}
                      disabled={!canEnhance}
                    >
                      強化実行
                    </button>
                  </div>
                );
              })() : <p className="max-badge">最大強化済み</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
