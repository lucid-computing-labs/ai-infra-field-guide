import React, {useState} from 'react';

type Level = 'gpu' | 'nvlink' | 'nvl72' | 'superpod' | 'fabric';

interface LevelInfo {
  label: string;
  description: string;
  gpuCount: string;
  bandwidth: string;
  latency: string;
  observable: string;
  diagram: React.ReactNode;
}

const GPU_COLOR = '#4a90d9';
const NVLINK_COLOR = '#2e7d32';
const IB_COLOR = '#e65100';

function GpuBox({label, size = 40}: {label: string; size?: number}) {
  return (
    <g>
      <rect width={size} height={size} rx={4} fill={GPU_COLOR} />
      <text
        x={size / 2}
        y={size / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fontSize={size > 30 ? 10 : 7}
        fontWeight="bold"
      >
        {label}
      </text>
    </g>
  );
}

function GpuLevel() {
  return (
    <svg viewBox="0 0 200 120" width="100%" style={{maxWidth: 320}}>
      <g transform="translate(70,20)">
        <rect width={60} height={60} rx={6} fill={GPU_COLOR} />
        <text x={30} y={32} textAnchor="middle" fill="#fff" fontSize={11} fontWeight="bold">
          GPU
        </text>
        <text x={30} y={48} textAnchor="middle" fill="#fff" fontSize={8}>
          80 GB HBM3e
        </text>
      </g>
      <text x={100} y={100} textAnchor="middle" fill="var(--ifm-font-color-base)" fontSize={10}>
        Single Blackwell GPU (B200)
      </text>
    </svg>
  );
}

function NvlinkLevel() {
  return (
    <svg viewBox="0 0 360 160" width="100%" style={{maxWidth: 480}}>
      {/* NVLink domain box */}
      <rect x={10} y={10} width={340} height={100} rx={8} fill="none" stroke={NVLINK_COLOR} strokeWidth={2} strokeDasharray="6,3" />
      <text x={180} y={30} textAnchor="middle" fill={NVLINK_COLOR} fontSize={10} fontWeight="bold">
        NVLink Domain (NVSwitch-connected)
      </text>
      {/* GPUs */}
      {Array.from({length: 8}).map((_, i) => (
        <g key={i} transform={`translate(${25 + i * 40}, 45)`}>
          <GpuBox label={`G${i}`} size={32} />
        </g>
      ))}
      {/* NVLink bus line */}
      <line x1={25} y1={85} x2={345} y2={85} stroke={NVLINK_COLOR} strokeWidth={3} />
      <text x={180} y={130} textAnchor="middle" fill="var(--ifm-font-color-base)" fontSize={9}>
        8 GPUs connected via NVLink &mdash; 900 GB/s per GPU bidirectional
      </text>
      <text x={180} y={150} textAnchor="middle" fill="var(--ifm-color-emphasis-600)" fontSize={8}>
        All-to-all communication, no SmartNIC visibility
      </text>
    </svg>
  );
}

function Nvl72Level() {
  return (
    <svg viewBox="0 0 400 220" width="100%" style={{maxWidth: 520}}>
      {/* Rack outline */}
      <rect x={5} y={5} width={390} height={175} rx={8} fill="none" stroke="var(--ifm-color-emphasis-400)" strokeWidth={2} />
      <text x={200} y={25} textAnchor="middle" fill="var(--ifm-font-color-base)" fontSize={11} fontWeight="bold">
        NVL72 Rack (72 GPUs)
      </text>
      {/* NVLink domains */}
      {Array.from({length: 4}).map((_, row) => (
        <g key={row}>
          <rect
            x={15}
            y={35 + row * 35}
            width={370}
            height={28}
            rx={4}
            fill="none"
            stroke={NVLINK_COLOR}
            strokeWidth={1}
            strokeDasharray="4,2"
          />
          {Array.from({length: 18}).map((_, col) => (
            <g key={col} transform={`translate(${22 + col * 20}, ${39 + row * 35})`}>
              <rect width={16} height={20} rx={2} fill={GPU_COLOR} opacity={0.85} />
              <text x={8} y={13} textAnchor="middle" fill="#fff" fontSize={5}>
                {row * 18 + col}
              </text>
            </g>
          ))}
        </g>
      ))}
      <text x={200} y={195} textAnchor="middle" fill="var(--ifm-font-color-base)" fontSize={9}>
        72 GPUs across NVLink domains &mdash; ~130 kW liquid-cooled rack
      </text>
      <text x={200} y={210} textAnchor="middle" fill="var(--ifm-color-emphasis-600)" fontSize={8}>
        Intra-rack: NVLink (900 GB/s/GPU). External connectivity: InfiniBand NICs.
      </text>
    </svg>
  );
}

function SuperPodLevel() {
  return (
    <svg viewBox="0 0 440 200" width="100%" style={{maxWidth: 560}}>
      {/* Spine switches */}
      <text x={220} y={18} textAnchor="middle" fill="var(--ifm-font-color-base)" fontSize={11} fontWeight="bold">
        SuperPOD (~576 GPUs)
      </text>
      <g>
        {Array.from({length: 4}).map((_, i) => (
          <g key={i}>
            <rect x={100 + i * 70} y={30} width={50} height={20} rx={3} fill={IB_COLOR} />
            <text x={125 + i * 70} y={43} textAnchor="middle" fill="#fff" fontSize={7}>
              Spine {i}
            </text>
          </g>
        ))}
      </g>
      {/* Racks */}
      {Array.from({length: 8}).map((_, i) => (
        <g key={i}>
          <rect x={12 + i * 53} y={90} width={46} height={70} rx={4} fill="none" stroke="var(--ifm-color-emphasis-400)" strokeWidth={1.5} />
          <text x={35 + i * 53} y={105} textAnchor="middle" fill="var(--ifm-font-color-base)" fontSize={7} fontWeight="bold">
            NVL72
          </text>
          {/* Mini GPUs */}
          {Array.from({length: 12}).map((_, j) => (
            <rect key={j} x={16 + i * 53 + (j % 4) * 10} y={112 + Math.floor(j / 4) * 12} width={8} height={10} rx={1} fill={GPU_COLOR} opacity={0.7} />
          ))}
          {/* IB link */}
          <line x1={35 + i * 53} y1={90} x2={35 + i * 53} y2={55} stroke={IB_COLOR} strokeWidth={1.5} />
        </g>
      ))}
      <text x={220} y={185} textAnchor="middle" fill="var(--ifm-font-color-base)" fontSize={9}>
        8 NVL72 racks connected via InfiniBand fat-tree fabric
      </text>
      <text x={220} y={198} textAnchor="middle" fill="var(--ifm-color-emphasis-600)" fontSize={8}>
        Inter-rack: 400 Gb/s InfiniBand per link. SmartNICs can observe this traffic.
      </text>
    </svg>
  );
}

function FabricLevel() {
  return (
    <svg viewBox="0 0 480 220" width="100%" style={{maxWidth: 600}}>
      <text x={240} y={18} textAnchor="middle" fill="var(--ifm-font-color-base)" fontSize={11} fontWeight="bold">
        Full Cluster (multiple SuperPODs)
      </text>
      {/* Core switches */}
      <rect x={170} y={30} width={140} height={24} rx={4} fill="#6a1b9a" />
      <text x={240} y={45} textAnchor="middle" fill="#fff" fontSize={9}>
        Core / Director Switches
      </text>
      {/* SuperPODs */}
      {Array.from({length: 4}).map((_, i) => (
        <g key={i}>
          <rect x={20 + i * 115} y={100} width={100} height={80} rx={6} fill="none" stroke={IB_COLOR} strokeWidth={2} />
          <text x={70 + i * 115} y={120} textAnchor="middle" fill="var(--ifm-font-color-base)" fontSize={9} fontWeight="bold">
            SuperPOD {i}
          </text>
          <text x={70 + i * 115} y={135} textAnchor="middle" fill="var(--ifm-color-emphasis-600)" fontSize={7}>
            576 GPUs
          </text>
          {/* Mini racks */}
          {Array.from({length: 4}).map((_, j) => (
            <rect key={j} x={30 + i * 115 + j * 20} y={145} width={16} height={24} rx={2} fill="var(--ifm-color-emphasis-300)" />
          ))}
          {/* Link to core */}
          <line x1={70 + i * 115} y1={100} x2={70 + i * 115} y2={58} stroke={IB_COLOR} strokeWidth={1.5} />
        </g>
      ))}
      <text x={240} y={205} textAnchor="middle" fill="var(--ifm-font-color-base)" fontSize={9}>
        SuperPODs interconnected via core switch layer &mdash; 2,000+ GPUs
      </text>
      <text x={240} y={218} textAnchor="middle" fill="var(--ifm-color-emphasis-600)" fontSize={8}>
        East-west traffic observable at spine/core. NVLink traffic remains invisible at every scale.
      </text>
    </svg>
  );
}

const levels: Record<Level, LevelInfo> = {
  gpu: {
    label: 'Single GPU',
    description: 'The fundamental compute unit. A modern Blackwell B200 GPU has 208 billion transistors, 80 GB of HBM3e memory, and can deliver ~2.25 PFLOPS of FP8 compute.',
    gpuCount: '1',
    bandwidth: '8 TB/s (HBM)',
    latency: '—',
    observable: 'BMC telemetry, power draw, temperature',
    diagram: <GpuLevel />,
  },
  nvlink: {
    label: 'NVLink Domain',
    description: 'A group of GPUs (typically 8 in a DGX node) connected via NVLink through NVSwitch. Every GPU can communicate with every other GPU at 900 GB/s bidirectional — without touching the network fabric.',
    gpuCount: '8',
    bandwidth: '900 GB/s per GPU',
    latency: '~1-2 \u00B5s',
    observable: 'Not visible to network SmartNICs or external monitors',
    diagram: <NvlinkLevel />,
  },
  nvl72: {
    label: 'NVL72 Rack',
    description: 'A single liquid-cooled rack containing 72 Blackwell GPUs connected via NVLink. The entire rack acts as one large NVLink domain. External connectivity is via InfiniBand NICs — this is the boundary where network-based monitoring begins to see traffic.',
    gpuCount: '72',
    bandwidth: '900 GB/s (NVLink) / 400 Gb/s (IB)',
    latency: '~1-5 \u00B5s (NVLink) / ~1-5 \u00B5s (IB)',
    observable: 'IB traffic at NIC boundary. NVLink traffic within rack is invisible externally.',
    diagram: <Nvl72Level />,
  },
  superpod: {
    label: 'SuperPOD',
    description: 'Multiple NVL72 racks connected via an InfiniBand fat-tree network. A SuperPOD typically contains 8 racks (576 GPUs). All inter-rack traffic flows over InfiniBand and is observable via SmartNICs and switch telemetry.',
    gpuCount: '~576',
    bandwidth: '400 Gb/s IB per link',
    latency: '~3-10 \u00B5s',
    observable: 'Full visibility via SmartNICs, switch counters, and TAPs on IB fabric',
    diagram: <SuperPodLevel />,
  },
  fabric: {
    label: 'Full Cluster',
    description: 'Multiple SuperPODs connected through a core switch layer. Large training clusters (10,000+ GPUs) use multi-tier fat-tree or Clos topologies. WAN links may connect geographically distributed clusters.',
    gpuCount: '2,000+',
    bandwidth: '400 Gb/s IB per link',
    latency: '~5-50 \u00B5s (varies with tier)',
    observable: 'Full IB fabric observable. Cross-DC WAN links are additional observation points.',
    diagram: <FabricLevel />,
  },
};

const levelOrder: Level[] = ['gpu', 'nvlink', 'nvl72', 'superpod', 'fabric'];

export default function TopologyExplorer() {
  const [currentLevel, setCurrentLevel] = useState<Level>('gpu');
  const info = levels[currentLevel];
  const currentIndex = levelOrder.indexOf(currentLevel);

  return (
    <div className="topology-explorer">
      <div className="topology-explorer__header">
        <span className="topology-explorer__title">Cluster Topology Explorer</span>
        <div className="topology-explorer__controls">
          {levelOrder.map((level) => (
            <button
              key={level}
              className={`topology-explorer__btn${currentLevel === level ? ' topology-explorer__btn--active' : ''}`}
              onClick={() => setCurrentLevel(level)}
            >
              {levels[level].label}
            </button>
          ))}
        </div>
      </div>

      <div className="topology-explorer__diagram">
        {info.diagram}
      </div>

      <p style={{lineHeight: 1.7, marginTop: '0.5rem'}}>{info.description}</p>

      <div className="topology-explorer__stats">
        <div className="topology-explorer__stat">
          <div className="topology-explorer__stat-label">GPU Count</div>
          <div className="topology-explorer__stat-value">{info.gpuCount}</div>
        </div>
        <div className="topology-explorer__stat">
          <div className="topology-explorer__stat-label">Bandwidth</div>
          <div className="topology-explorer__stat-value">{info.bandwidth}</div>
        </div>
        <div className="topology-explorer__stat">
          <div className="topology-explorer__stat-label">Latency</div>
          <div className="topology-explorer__stat-value">{info.latency}</div>
        </div>
      </div>

      <div className="topology-explorer__note">
        <strong>Verification note:</strong> {info.observable}
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}>
        <button
          className="topology-explorer__btn"
          disabled={currentIndex === 0}
          onClick={() => setCurrentLevel(levelOrder[currentIndex - 1])}
        >
          Zoom In
        </button>
        <button
          className="topology-explorer__btn"
          disabled={currentIndex === levelOrder.length - 1}
          onClick={() => setCurrentLevel(levelOrder[currentIndex + 1])}
        >
          Zoom Out
        </button>
      </div>
    </div>
  );
}
