import React, {useState} from 'react';

interface Generation {
  name: string;
  gpu: string;
  year: number;
  rackPowerKw: number;
  cooling: string;
  tdpPerGpu: number;
  memoryGb: number;
  memoryType: string;
  computePflops: number;
  computeUnit: string;
  coolantTemp?: string;
  notes: string;
}

const generations: Generation[] = [
  {
    name: 'Ampere',
    gpu: 'A100',
    year: 2020,
    rackPowerKw: 6.5,
    cooling: 'Air-cooled',
    tdpPerGpu: 400,
    memoryGb: 80,
    memoryType: 'HBM2e',
    computePflops: 0.312,
    computeUnit: 'FP16',
    notes: 'Standard air-cooled racks. Conventional data center cooling infrastructure sufficient. 8 GPUs per DGX A100 node.',
  },
  {
    name: 'Hopper',
    gpu: 'H100',
    year: 2022,
    rackPowerKw: 10.2,
    cooling: 'Air or liquid',
    tdpPerGpu: 700,
    memoryGb: 80,
    memoryType: 'HBM3',
    computePflops: 0.990,
    computeUnit: 'FP16',
    notes: 'Pushed the limits of air cooling. Many deployments added rear-door heat exchangers. 8 GPUs per DGX H100 node.',
  },
  {
    name: 'Blackwell',
    gpu: 'GB200',
    year: 2024,
    rackPowerKw: 132,
    cooling: 'Liquid required',
    tdpPerGpu: 1200,
    memoryGb: 192,
    memoryType: 'HBM3e',
    computePflops: 2.25,
    computeUnit: 'FP8',
    coolantTemp: '40-45°C supply',
    notes: 'Air cooling physically impossible. NVL72 rack: 72 GPUs in a single liquid-cooled cabinet. Full direct liquid cooling (DLC) mandatory.',
  },
  {
    name: 'Rubin (projected)',
    gpu: 'R100',
    year: 2026,
    rackPowerKw: 165,
    cooling: 'Liquid required',
    tdpPerGpu: 1400,
    memoryGb: 288,
    memoryType: 'HBM4',
    computePflops: 4.5,
    computeUnit: 'FP8',
    coolantTemp: '35-45°C supply',
    notes: 'Projected specs. Expected to continue rack-scale liquid cooling. HBM4 enables higher memory bandwidth. Power density continues to climb.',
  },
];

const BAR_MAX_WIDTH = 280;

export default function PowerDensityTimeline() {
  const [selected, setSelected] = useState(2); // Default to Blackwell
  const maxPower = Math.max(...generations.map((g) => g.rackPowerKw));
  const gen = generations[selected];

  return (
    <div className="power-timeline">
      <div className="power-timeline__header">
        <span className="power-timeline__title">Power Density Timeline</span>
        <span className="power-timeline__subtitle">Click a generation to explore</span>
      </div>

      <div className="power-timeline__bars">
        {generations.map((g, i) => {
          const widthPct = (g.rackPowerKw / maxPower) * 100;
          const isSelected = i === selected;
          return (
            <button
              key={g.name}
              className={`power-timeline__row${isSelected ? ' power-timeline__row--active' : ''}`}
              onClick={() => setSelected(i)}
            >
              <div className="power-timeline__row-label">
                <strong>{g.gpu}</strong>
                <span className="power-timeline__row-year">{g.year}</span>
              </div>
              <div className="power-timeline__bar-track">
                <div
                  className="power-timeline__bar-fill"
                  style={{width: `${widthPct}%`}}
                />
                <span className="power-timeline__bar-value">{g.rackPowerKw} kW</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="power-timeline__detail">
        <div className="power-timeline__detail-title">
          {gen.name} ({gen.gpu}) — {gen.year}
        </div>
        <div className="topology-explorer__stats">
          <div className="topology-explorer__stat">
            <div className="topology-explorer__stat-label">TDP / GPU</div>
            <div className="topology-explorer__stat-value">{gen.tdpPerGpu} W</div>
          </div>
          <div className="topology-explorer__stat">
            <div className="topology-explorer__stat-label">Memory</div>
            <div className="topology-explorer__stat-value">{gen.memoryGb} GB</div>
          </div>
          <div className="topology-explorer__stat">
            <div className="topology-explorer__stat-label">Compute</div>
            <div className="topology-explorer__stat-value">{gen.computePflops} PFLOPS</div>
          </div>
          <div className="topology-explorer__stat">
            <div className="topology-explorer__stat-label">Cooling</div>
            <div className="topology-explorer__stat-value" style={{fontSize: '1rem'}}>{gen.cooling}</div>
          </div>
        </div>
        <p className="power-timeline__notes">{gen.notes}</p>

        {/* Multiplier callout */}
        {selected > 0 && (
          <div className="power-timeline__callout">
            <strong>{(gen.rackPowerKw / generations[0].rackPowerKw).toFixed(1)}x</strong> the rack power of {generations[0].gpu} &mdash;
            {' '}<strong>{(gen.computePflops / generations[0].computePflops).toFixed(1)}x</strong> the compute.
            Power grew {((gen.rackPowerKw / generations[0].rackPowerKw) / (gen.computePflops / generations[0].computePflops)).toFixed(1)}x per unit of compute improvement.
          </div>
        )}
      </div>
    </div>
  );
}
