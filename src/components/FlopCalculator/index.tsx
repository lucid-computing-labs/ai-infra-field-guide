import React, {useState} from 'react';

interface GpuOption {
  name: string;
  pflops: number;
  memoryGb: number;
  year: number;
}

const gpuOptions: GpuOption[] = [
  {name: 'A100 (FP16)', pflops: 0.312, memoryGb: 80, year: 2020},
  {name: 'H100 (FP16)', pflops: 0.990, memoryGb: 80, year: 2022},
  {name: 'GB200 (FP8)', pflops: 2.25, memoryGb: 192, year: 2024},
];

function formatNumber(n: number): string {
  if (n >= 1e24) return `${(n / 1e24).toFixed(1)}e24`;
  if (n >= 1e21) return `${(n / 1e21).toFixed(1)} zettaFLOP`;
  if (n >= 1e18) return `${(n / 1e18).toFixed(1)} exaFLOP`;
  if (n >= 1e15) return `${(n / 1e15).toFixed(1)} petaFLOP`;
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)} teraFLOP`;
  return `${n.toExponential(2)} FLOP`;
}

function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  if (hours < 24) return `${hours.toFixed(1)} hours`;
  if (hours < 24 * 7) return `${(hours / 24).toFixed(1)} days`;
  if (hours < 24 * 30) return `${(hours / (24 * 7)).toFixed(1)} weeks`;
  return `${(hours / (24 * 30)).toFixed(1)} months`;
}

function formatMemory(gb: number): string {
  if (gb >= 1000) return `${(gb / 1000).toFixed(1)} TB`;
  return `${gb.toFixed(0)} GB`;
}

export default function FlopCalculator() {
  const [params, setParams] = useState('70');
  const [tokens, setTokens] = useState('2');
  const [tokensUnit, setTokensUnit] = useState<'T' | 'B'>('T');
  const [gpuIndex, setGpuIndex] = useState(2);
  const [gpuCount, setGpuCount] = useState('1024');
  const [mfu, setMfu] = useState(40);

  const paramsB = parseFloat(params) || 0;
  const tokensNum = parseFloat(tokens) || 0;
  const tokensActual = tokensUnit === 'T' ? tokensNum * 1e12 : tokensNum * 1e9;
  const numGpus = parseInt(gpuCount) || 1;
  const gpu = gpuOptions[gpuIndex];

  // Chinchilla approximation: ~6 * N * D FLOP for a forward+backward pass
  const totalFlops = 6 * paramsB * 1e9 * tokensActual;

  // Effective throughput per GPU with MFU
  const effectivePflopsPerGpu = gpu.pflops * (mfu / 100);
  const effectiveFlopsPerSecond = effectivePflopsPerGpu * 1e15 * numGpus;

  // Training time
  const trainingSeconds = totalFlops / effectiveFlopsPerSecond;
  const trainingHours = trainingSeconds / 3600;

  // Memory estimate (rough: ~2 bytes per param for weights in mixed precision, ~16x for optimizer + activations + gradients)
  const modelMemoryGb = (paramsB * 2) / 1;
  const totalTrainingMemoryGb = modelMemoryGb * 16;
  const minGpusForMemory = Math.ceil(totalTrainingMemoryGb / gpu.memoryGb);

  // Power estimate
  const powerMw = (numGpus * (gpu.name.includes('A100') ? 400 : gpu.name.includes('H100') ? 700 : 1200)) / 1e6;
  const energyMwh = powerMw * 1000 * trainingHours;

  return (
    <div className="flop-calc">
      <div className="power-timeline__header">
        <span className="power-timeline__title">FLOP Accounting Calculator</span>
        <span className="power-timeline__subtitle">Estimate compute requirements for training runs</span>
      </div>

      <div className="flop-calc__inputs">
        <div className="flop-calc__field">
          <label className="flop-calc__label">Model parameters</label>
          <div className="flop-calc__input-row">
            <input
              type="number"
              className="flop-calc__input"
              value={params}
              onChange={(e) => setParams(e.target.value)}
              min={0}
              step={1}
            />
            <span className="flop-calc__unit">billion</span>
          </div>
        </div>

        <div className="flop-calc__field">
          <label className="flop-calc__label">Training tokens</label>
          <div className="flop-calc__input-row">
            <input
              type="number"
              className="flop-calc__input"
              value={tokens}
              onChange={(e) => setTokens(e.target.value)}
              min={0}
              step={0.1}
            />
            <select
              className="flop-calc__select"
              value={tokensUnit}
              onChange={(e) => setTokensUnit(e.target.value as 'T' | 'B')}
            >
              <option value="T">trillion</option>
              <option value="B">billion</option>
            </select>
          </div>
        </div>

        <div className="flop-calc__field">
          <label className="flop-calc__label">GPU type</label>
          <select
            className="flop-calc__select flop-calc__select--full"
            value={gpuIndex}
            onChange={(e) => setGpuIndex(Number(e.target.value))}
          >
            {gpuOptions.map((g, i) => (
              <option key={g.name} value={i}>{g.name} — {g.pflops} PFLOPS, {g.memoryGb} GB</option>
            ))}
          </select>
        </div>

        <div className="flop-calc__field">
          <label className="flop-calc__label">GPU count</label>
          <input
            type="number"
            className="flop-calc__input"
            value={gpuCount}
            onChange={(e) => setGpuCount(e.target.value)}
            min={1}
            step={1}
          />
        </div>

        <div className="flop-calc__field">
          <label className="flop-calc__label">Model FLOP Utilization (MFU): {mfu}%</label>
          <input
            type="range"
            className="flop-calc__range"
            value={mfu}
            onChange={(e) => setMfu(Number(e.target.value))}
            min={10}
            max={70}
            step={1}
          />
          <div className="flop-calc__range-labels">
            <span>10% (poor)</span>
            <span>40% (typical)</span>
            <span>70% (excellent)</span>
          </div>
        </div>
      </div>

      <div className="flop-calc__results">
        <div className="topology-explorer__stats">
          <div className="topology-explorer__stat">
            <div className="topology-explorer__stat-label">Total FLOP</div>
            <div className="topology-explorer__stat-value" style={{fontSize: '1.1rem'}}>
              {formatNumber(totalFlops)}
            </div>
          </div>
          <div className="topology-explorer__stat">
            <div className="topology-explorer__stat-label">Training time</div>
            <div className="topology-explorer__stat-value" style={{fontSize: '1.1rem'}}>
              {trainingHours > 0 ? formatDuration(trainingHours) : '—'}
            </div>
          </div>
          <div className="topology-explorer__stat">
            <div className="topology-explorer__stat-label">Min. GPUs (memory)</div>
            <div className="topology-explorer__stat-value" style={{fontSize: '1.1rem'}}>
              {minGpusForMemory}
            </div>
          </div>
          <div className="topology-explorer__stat">
            <div className="topology-explorer__stat-label">Energy</div>
            <div className="topology-explorer__stat-value" style={{fontSize: '1.1rem'}}>
              {energyMwh > 1000 ? `${(energyMwh / 1000).toFixed(1)} GWh` : `${energyMwh.toFixed(0)} MWh`}
            </div>
          </div>
        </div>

        {numGpus < minGpusForMemory && (
          <div className="flop-calc__warning">
            {numGpus} GPUs may not have enough aggregate memory. The model training state needs ~{formatMemory(totalTrainingMemoryGb)} but {numGpus} {gpu.name.split(' ')[0]} GPUs provide {formatMemory(numGpus * gpu.memoryGb)}.
          </div>
        )}

        <div className="power-timeline__callout" style={{marginTop: '1rem'}}>
          <strong>Verification note:</strong> A {paramsB}B parameter model training on {numGpus} {gpu.name.split(' ')[0]} GPUs
          would draw ~{(powerMw * 1000).toFixed(0)} MW of IT power. At PUE 1.15, that's ~{(powerMw * 1000 * 1.15).toFixed(0)} MW total facility power.
          This power signature is detectable at the facility level and is difficult to fake — you can't hide {(powerMw * 1000).toFixed(0)} MW of power draw.
        </div>
      </div>
    </div>
  );
}
