import React, {useState} from 'react';

type ProbeType = 'smartnic' | 'bmc' | 'tap' | 'dcgm';

interface Probe {
  id: ProbeType;
  label: string;
  color: string;
  description: string;
  sees: string[];
  blind: string[];
}

const probes: Probe[] = [
  {
    id: 'smartnic',
    label: 'SmartNIC',
    color: '#e65100',
    description: 'Monitors traffic on InfiniBand ports. Sees all data entering or leaving a node via the network fabric.',
    sees: [
      'Inter-rack InfiniBand traffic (all-reduce across racks)',
      'Storage traffic (checkpoint writes to remote storage)',
      'Control plane traffic (scheduler, health checks)',
      'Cross-SuperPOD and WAN traffic',
    ],
    blind: [
      'NVLink GPU-to-GPU traffic within the rack',
      'Local memory access patterns',
      'GPU compute activity (utilization, kernels running)',
      'Power draw and thermal state',
    ],
  },
  {
    id: 'bmc',
    label: 'BMC',
    color: '#2e7d32',
    description: 'Baseboard Management Controller. Hardware-level monitoring of power, temperature, and fan/pump speeds via IPMI/Redfish.',
    sees: [
      'Per-node power consumption (distinctive training signature)',
      'CPU and GPU temperatures',
      'Fan speeds and coolant flow rates',
      'Hardware health (DIMM errors, PSU status)',
    ],
    blind: [
      'What computation is actually running',
      'Network traffic content or patterns',
      'Software-level metrics (loss curves, throughput)',
      'NVLink utilization details',
    ],
  },
  {
    id: 'tap',
    label: 'Network TAP',
    color: '#6a1b9a',
    description: 'Physical device that creates an exact copy of traffic on a link for analysis. Highest fidelity network monitoring.',
    sees: [
      'Complete packet-level copy of InfiniBand traffic',
      'Traffic timing and flow patterns',
      'Communication topology between nodes',
      'Anomalous or unexpected traffic flows',
    ],
    blind: [
      'NVLink traffic (never touches the IB fabric)',
      'Encrypted payload contents (can see flow metadata)',
      'GPU-internal operations',
      'Traffic on links without a TAP installed',
    ],
  },
  {
    id: 'dcgm',
    label: 'DCGM Agent',
    color: '#4a90d9',
    description: 'NVIDIA Data Center GPU Manager. Software agent that reports detailed GPU metrics. Requires trust in the host OS.',
    sees: [
      'GPU SM utilization and memory usage',
      'NVLink bandwidth utilization per GPU',
      'ECC error counts and thermal throttling events',
      'Running process and compute kernel information',
    ],
    blind: [
      'Network traffic patterns',
      'Other nodes\' activity',
      'Facility-level power and cooling metrics',
      'Can be spoofed if host OS is compromised',
    ],
  },
];

const ZONE_COLORS = {
  nvlink: 'rgba(46, 125, 50, 0.12)',
  ib: 'rgba(230, 81, 0, 0.10)',
};

export default function NetworkVisibilityMap() {
  const [activeProbe, setActiveProbe] = useState<ProbeType>('smartnic');
  const probe = probes.find((p) => p.id === activeProbe)!;

  return (
    <div className="visibility-map">
      <div className="visibility-map__header">
        <span className="power-timeline__title">Network Visibility Map</span>
        <span className="power-timeline__subtitle">Select a monitoring probe to see what it can and cannot observe</span>
      </div>

      <div className="visibility-map__controls">
        {probes.map((p) => (
          <button
            key={p.id}
            className={`topology-explorer__btn${activeProbe === p.id ? ' topology-explorer__btn--active' : ''}`}
            style={activeProbe === p.id ? {background: p.color, borderColor: p.color} : {}}
            onClick={() => setActiveProbe(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Diagram */}
      <div className="visibility-map__diagram">
        <svg viewBox="0 0 500 240" width="100%" style={{maxWidth: 600}}>
          {/* NVLink zone */}
          <rect x={15} y={30} width={225} height={170} rx={10} fill={ZONE_COLORS.nvlink}
            stroke="#2e7d32" strokeWidth={1.5} strokeDasharray="6,3"
            opacity={activeProbe === 'smartnic' || activeProbe === 'tap' ? 0.3 : 1}
          />
          <text x={127} y={22} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#2e7d32">
            NVLink Domain (intra-rack)
          </text>

          {/* GPUs in NVLink zone */}
          {Array.from({length: 8}).map((_, i) => (
            <g key={i} transform={`translate(${30 + (i % 4) * 52}, ${50 + Math.floor(i / 4) * 60})`}>
              <rect width={40} height={40} rx={4} fill="#4a90d9"
                opacity={activeProbe === 'dcgm' ? 1 : 0.5}
              />
              <text x={20} y={23} textAnchor="middle" fill="#fff" fontSize={9} fontWeight="bold">
                GPU {i}
              </text>
            </g>
          ))}
          {/* NVLink bus lines */}
          <line x1={30} y1={100} x2={230} y2={100} stroke="#2e7d32" strokeWidth={2}
            opacity={activeProbe === 'dcgm' ? 1 : 0.3}
          />
          <line x1={30} y1={160} x2={230} y2={160} stroke="#2e7d32" strokeWidth={2}
            opacity={activeProbe === 'dcgm' ? 1 : 0.3}
          />

          {/* IB boundary line */}
          <line x1={260} y1={30} x2={260} y2={200} stroke="#e65100" strokeWidth={2.5} strokeDasharray="8,4" />
          <text x={262} y={215} fontSize={8} fill="#e65100" fontWeight="bold">IB boundary</text>

          {/* IB fabric zone */}
          <rect x={275} y={30} width={210} height={170} rx={10} fill={ZONE_COLORS.ib}
            stroke="#e65100" strokeWidth={1.5} strokeDasharray="6,3"
            opacity={activeProbe === 'dcgm' || activeProbe === 'bmc' ? 0.3 : 1}
          />
          <text x={380} y={22} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#e65100">
            InfiniBand Fabric (inter-rack)
          </text>

          {/* Spine switches */}
          {Array.from({length: 3}).map((_, i) => (
            <g key={i} transform={`translate(${290 + i * 60}, 55)`}>
              <rect width={50} height={24} rx={4} fill="#e65100"
                opacity={activeProbe === 'smartnic' || activeProbe === 'tap' ? 1 : 0.5}
              />
              <text x={25} y={15} textAnchor="middle" fill="#fff" fontSize={8}>
                Switch {i}
              </text>
            </g>
          ))}

          {/* Remote racks */}
          {Array.from({length: 3}).map((_, i) => (
            <g key={i} transform={`translate(${290 + i * 60}, 110)`}>
              <rect width={50} height={60} rx={4} fill="none" stroke="var(--ifm-color-emphasis-400)" strokeWidth={1.5}
                opacity={activeProbe === 'smartnic' || activeProbe === 'tap' ? 1 : 0.5}
              />
              <text x={25} y={18} textAnchor="middle" fill="var(--ifm-font-color-base)" fontSize={8} fontWeight="bold">
                Rack {i + 1}
              </text>
              {Array.from({length: 4}).map((_, j) => (
                <rect key={j} x={6 + j * 11} y={28} width={9} height={22} rx={2} fill="#4a90d9" opacity={0.5} />
              ))}
              <line x1={25} y1={110} x2={25} y2={80} stroke="#e65100" strokeWidth={1} />
            </g>
          ))}

          {/* BMC indicator */}
          {activeProbe === 'bmc' && (
            <g>
              <rect x={70} y={145} width={110} height={20} rx={3} fill="#2e7d32" opacity={0.8} />
              <text x={125} y={158} textAnchor="middle" fill="#fff" fontSize={8}>
                BMC: power, temp, fans
              </text>
            </g>
          )}

          {/* Probe position indicator */}
          {(activeProbe === 'smartnic' || activeProbe === 'tap') && (
            <g>
              <circle cx={260} cy={115} r={8} fill={probe.color} opacity={0.9} />
              <text x={260} y={118} textAnchor="middle" fill="#fff" fontSize={7} fontWeight="bold">
                {activeProbe === 'smartnic' ? 'S' : 'T'}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Probe details */}
      <div className="visibility-map__detail">
        <div style={{fontWeight: 700, fontSize: '1rem', color: probe.color, marginBottom: '0.5rem'}}>
          {probe.label}
        </div>
        <p style={{margin: '0 0 1rem', lineHeight: 1.6}}>{probe.description}</p>

        <div className="visibility-map__columns">
          <div className="visibility-map__col visibility-map__col--sees">
            <div className="visibility-map__col-header">Visible</div>
            <ul>
              {probe.sees.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="visibility-map__col visibility-map__col--blind">
            <div className="visibility-map__col-header">Blind spots</div>
            <ul>
              {probe.blind.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
