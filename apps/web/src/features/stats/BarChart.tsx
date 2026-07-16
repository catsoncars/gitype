import { useState } from 'react';
import './BarChart.css';

export interface BarChartItem {
  label: string;
  value: number;
  detail?: string;
}

interface BarChartProps {
  items: BarChartItem[];
  valueFormat: (value: number) => string;
}

export function BarChart({ items, valueFormat }: BarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="bar-chart">
      {items.map((item, i) => {
        const pct = (item.value / maxValue) * 100;
        return (
          <div
            key={item.label}
            className="bar-row"
            tabIndex={0}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            onFocus={() => setActiveIndex(i)}
            onBlur={() => setActiveIndex(null)}
          >
            <span className="bar-label">{item.label}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="bar-value">{valueFormat(item.value)}</span>
            {activeIndex === i && (
              <div className="bar-tooltip" role="tooltip">
                <strong>{valueFormat(item.value)}</strong>
                {item.detail ? <span>{item.detail}</span> : null}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
