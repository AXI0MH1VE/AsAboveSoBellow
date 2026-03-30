import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Globe, 
  Zap, 
  Terminal, 
  Activity, 
  Settings, 
  Lock,
  Wifi,
  AlertTriangle,
  RefreshCcw
} from 'lucide-react';

const App = () => {
  const [torStatus, setTorStatus] = useState('offline');
  const [i2pStatus, setI2pStatus] = useState('offline');
  const [activeTool, setActiveTool] = useState('dashboard');
  const [metrics, setMetrics] = useState({
    inbound: '0 KB/s',
    outbound: '0 KB/s',
    peers: 0
  });

  // Mock status updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setTorStatus('online');
      setI2pStatus('online');
      setMetrics({
        inbound: '42.5 KB/s',
        outbound: '12.8 KB/s',
        peers: 24
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-section">
          <Shield className="logo-icon" size={32} />
          <span className="logo-text">NEXUS-X</span>
        </div>
        
        <nav className="nav-menu">
          <div 
            className={`nav-item ${activeTool === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTool('dashboard')}
          >
            <Activity size={20} />
            <span>Dashboard</span>
          </div>
          <div 
            className={`nav-item ${activeTool === 'tor' ? 'active' : ''}`}
            onClick={() => setActiveTool('tor')}
          >
            <Lock size={20} />
            <span>Tor Manager</span>
          </div>
          <div 
            className={`nav-item ${activeTool === 'i2p' ? 'active' : ''}`}
            onClick={() => setActiveTool('i2p')}
          >
            <Globe size={20} />
            <span>I2P Mesh</span>
          </div>
          <div 
            className={`nav-item ${activeTool === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveTool('tools')}
          >
            <Terminal size={20} />
            <span>Advanced Tools</span>
          </div>
          <div 
            className={`nav-item ${activeTool === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTool('settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </nav>

        <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div className={`status-indicator ${torStatus === 'online' ? 'status-online' : 'status-offline'}`} style={{ width: '8px', height: '8px', padding: 0 }}></div>
            <span>Encrypted Tunnel Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="dashboard-header">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Operational Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitoring network integrity and anonymity vectors.</p>
        </header>

        {/* Global Stats Grid */}
        <div className="stats-grid">
          <div className="status-card">
            <div className="card-header">
              <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>TOR NETWORK</span>
              <span className={`status-indicator ${torStatus === 'online' ? 'status-online' : 'status-offline'}`}>
                {torStatus}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: '700' }}>3 Circuits</span>
              <span style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>Stable</span>
            </div>
          </div>

          <div className="status-card">
            <div className="card-header">
              <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>I2P MESH</span>
              <span className={`status-indicator ${i2pStatus === 'online' ? 'status-online' : 'status-offline'}`}>
                {i2pStatus}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: '700' }}>{metrics.peers} Peers</span>
              <RefreshCcw size={16} className="pulse" style={{ color: 'var(--accent-cyan)' }} />
            </div>
          </div>

          <div className="status-card">
            <div className="card-header">
              <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>TRAFFIC FLOW</span>
              <Zap size={20} style={{ color: 'var(--accent-amber)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Inbound:</span>
                <span style={{ fontWeight: '600', color: 'var(--accent-green)' }}>{metrics.inbound}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Outbound:</span>
                <span style={{ fontWeight: '600', color: 'var(--accent-cyan)' }}>{metrics.outbound}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Tool Section */}
        <section className="tool-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Advanced Network Tools</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Execute proxy-aware diagnostics and security audits.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ background: 'transparent', border: '1px solid var(--border-glass)', color: '#fff' }}>View Logs</button>
              <button>Execute Full Sweep</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <ToolCard 
              icon={<Shield size={24} />} 
              title="Identity Guard" 
              desc="Manage your Tor circuits and I2P anonymity status."
              status="Secure"
            />
            <ToolCard 
              icon={<Zap size={24} />} 
              title="Manual Control" 
              desc="Full human-in-the-loop override of all automated routing protocols."
              status="Ready"
            />
            <ToolCard 
              icon={<Activity size={24} />} 
              title="Causal Audit" 
              desc="Audit every packet against the established chain of logic."
              status="Live"
            />
          </div>
        </section>
      </main>
    </div>
  );
};

const ToolCard = ({ icon, title, desc, status }) => (
  <div style={{ 
    background: 'rgba(255,255,255,0.02)', 
    border: '1px solid rgba(255,255,255,0.05)', 
    padding: '1.5rem', 
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = 'rgba(0, 243, 255, 0.05)';
    e.currentTarget.style.borderColor = 'rgba(0, 243, 255, 0.2)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
  }}
  >
    <div style={{ color: 'var(--accent-cyan)' }}>{icon}</div>
    <div>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{title}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{desc}</p>
    </div>
    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.7rem', color: status === 'Alert' ? 'var(--accent-red)' : 'var(--text-muted)' }}>STATUS: {status}</span>
      <Zap size={14} style={{ color: status === 'Alert' ? 'var(--accent-red)' : 'var(--text-muted)' }} />
    </div>
  </div>
);

export default App;
