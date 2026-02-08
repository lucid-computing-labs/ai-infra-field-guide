import React, {useState, useMemo} from 'react';

interface Cluster {
  name: string;
  operator: string;
  location: string;
  acceleratorCount: string;
  hardware: string;
  power: string;
  networking: string;
  status: string;
  category: 'operational' | 'planned';
}

const clusters: Cluster[] = [
  {
    name: 'Colossus',
    operator: 'xAI',
    location: 'Memphis, TN',
    acceleratorCount: '~555,000 GPUs',
    hardware: 'H200 + GB200/GB300',
    power: '~2 GW (target)',
    networking: 'Spectrum-X Ethernet',
    status: 'Operational (Jan 2026)',
    category: 'operational',
  },
  {
    name: 'Project Rainier',
    operator: 'AWS (for Anthropic)',
    location: 'New Carlisle, IN',
    acceleratorCount: '~500,000 chips',
    hardware: 'Trainium2',
    power: '2.2 GW (site capacity)',
    networking: 'Custom AWS fabric',
    status: 'Operational (Oct 2025)',
    category: 'operational',
  },
  {
    name: 'Meta Cluster Fleet',
    operator: 'Meta',
    location: 'Multiple US sites',
    acceleratorCount: '~1.3M GPUs (fleet)',
    hardware: 'H100, H200',
    power: '>1 GW (aggregate)',
    networking: 'InfiniBand + RoCE',
    status: 'Operational (distributed)',
    category: 'operational',
  },
  {
    name: 'Stargate Phase 1',
    operator: 'OpenAI / Oracle',
    location: 'Abilene, TX',
    acceleratorCount: 'Not disclosed',
    hardware: 'GB200',
    power: '200 MW+ (Phase 1)',
    networking: 'Oracle Acceleron RoCE',
    status: 'Operational (Sep 2025)',
    category: 'operational',
  },
  {
    name: 'El Capitan',
    operator: 'LLNL (DOE)',
    location: 'Livermore, CA',
    acceleratorCount: '44,544 APUs',
    hardware: 'AMD MI300A',
    power: '30 MW',
    networking: 'HPE Slingshot-11',
    status: 'Operational (Jan 2025)',
    category: 'operational',
  },
  {
    name: 'Colossus Expansion',
    operator: 'xAI',
    location: 'Memphis + Southaven, MS',
    acceleratorCount: '1,000,000 GPUs',
    hardware: 'GB200/GB300',
    power: '2 GW+',
    networking: 'Spectrum-X Ethernet',
    status: 'Late 2026 (Medium confidence)',
    category: 'planned',
  },
  {
    name: 'Meta Prometheus',
    operator: 'Meta',
    location: 'New Albany, OH',
    acceleratorCount: '300,000-500,000 GPUs',
    hardware: 'GB200/GB300',
    power: '1+ GW',
    networking: 'InfiniBand + RoCE',
    status: 'H2 2026 (Medium confidence)',
    category: 'planned',
  },
  {
    name: 'Stargate Expansion',
    operator: 'OpenAI / Oracle / SoftBank',
    location: '6 US sites',
    acceleratorCount: '450,000+ GPUs (Abilene alone)',
    hardware: 'GB200/GB300',
    power: '~7 GW (all sites)',
    networking: 'Oracle Acceleron RoCE',
    status: '2026-2027 (High confidence)',
    category: 'planned',
  },
  {
    name: 'OCI Zettascale10',
    operator: 'Oracle',
    location: 'Multiple sites',
    acceleratorCount: 'Up to 800,000 GPUs',
    hardware: 'GB200 / MI450',
    power: 'Multi-GW',
    networking: 'Oracle fabric',
    status: 'H2 2026 (Medium confidence)',
    category: 'planned',
  },
  {
    name: 'HUMAIN Flagship',
    operator: 'HUMAIN (Saudi PIF)',
    location: 'Saudi Arabia + US',
    acceleratorCount: 'Up to 600,000 GPUs',
    hardware: 'GB300 + MI450',
    power: '500 MW+ (Phase 1)',
    networking: 'Mixed',
    status: '2026-2027 (Medium confidence)',
    category: 'planned',
  },
];

type SortField = 'name' | 'operator' | 'location' | 'power';

export default function ClusterTable() {
  const [filter, setFilter] = useState<'all' | 'operational' | 'planned'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = clusters;
    if (filter !== 'all') {
      result = result.filter(c => c.category === filter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.operator.toLowerCase().includes(q) ||
        c.hardware.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }
    result = [...result].sort((a, b) => {
      const av = a[sortField].toLowerCase();
      const bv = b[sortField].toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return result;
  }, [filter, sortField, sortAsc, search]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return ' \u2195';
    return sortAsc ? ' \u2191' : ' \u2193';
  };

  return (
    <div className="cluster-table">
      <div className="cluster-table__controls">
        <input
          type="text"
          placeholder="Search clusters..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="cluster-table__search"
        />
        <div className="cluster-table__filters">
          {(['all', 'operational', 'planned'] as const).map(f => (
            <button
              key={f}
              className={`cluster-table__filter-btn${filter === f ? ' cluster-table__filter-btn--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'operational' ? 'Operational' : 'Planned'}
            </button>
          ))}
        </div>
      </div>

      <div className="cluster-table__grid">
        {filtered.map(cluster => (
          <div
            key={cluster.name}
            className={`cluster-table__card cluster-table__card--${cluster.category}${expanded === cluster.name ? ' cluster-table__card--expanded' : ''}`}
            onClick={() => setExpanded(expanded === cluster.name ? null : cluster.name)}
          >
            <div className="cluster-table__card-header">
              <div>
                <span className={`cluster-table__badge cluster-table__badge--${cluster.category}`}>
                  {cluster.category === 'operational' ? 'Operational' : 'Planned'}
                </span>
                <h3 className="cluster-table__card-name">{cluster.name}</h3>
                <div className="cluster-table__card-operator">{cluster.operator}</div>
              </div>
            </div>

            <div className="cluster-table__card-stats">
              <div className="cluster-table__card-stat">
                <span className="cluster-table__card-stat-label">Accelerators</span>
                <span className="cluster-table__card-stat-value">{cluster.acceleratorCount}</span>
              </div>
              <div className="cluster-table__card-stat">
                <span className="cluster-table__card-stat-label">Power</span>
                <span className="cluster-table__card-stat-value">{cluster.power}</span>
              </div>
            </div>

            {expanded === cluster.name && (
              <div className="cluster-table__card-details">
                <div className="cluster-table__card-detail">
                  <strong>Location:</strong> {cluster.location}
                </div>
                <div className="cluster-table__card-detail">
                  <strong>Hardware:</strong> {cluster.hardware}
                </div>
                <div className="cluster-table__card-detail">
                  <strong>Networking:</strong> {cluster.networking}
                </div>
                <div className="cluster-table__card-detail">
                  <strong>Status:</strong> {cluster.status}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="cluster-table__count">
        Showing {filtered.length} of {clusters.length} clusters
      </div>
    </div>
  );
}
