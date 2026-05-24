import type { CharacterInstance } from '../../types';

interface ATBGaugeProps {
  char: CharacterInstance;
  pendingAbilityName?: string;
}

export function ATBGauge({ char, pendingAbilityName }: ATBGaugeProps) {
  const segments = char.atb.max;
  // 浮動小数点誤差で微小値が残った場合も0として扱う（閾値: 0.05未満）
  const filled = char.atb.current < 0.05 ? 0 : char.atb.current;

  return (
    <div className="atb-gauge">
      <div className="atb-segments">
        {Array.from({ length: segments }, (_, i) => {
          const segFill = Math.min(1, Math.max(0, filled - i));
          return (
            <div key={i} className="atb-segment">
              <div
                className="atb-fill"
                style={{ width: `${segFill * 100}%` }}
              />
            </div>
          );
        })}
      </div>
      {pendingAbilityName && (
        <span className="atb-action">{pendingAbilityName}</span>
      )}
    </div>
  );
}
