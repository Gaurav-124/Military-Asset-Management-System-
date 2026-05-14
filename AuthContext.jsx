import { useState, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

function TransferModal({ bases, assets, onClose, onSuccess }) {
  const [form, setForm] = useState({ asset: '', fromBase: '', toBase: '', equipmentType: '', quantity: '', transferDate: new Date().toISOString().split('T')[0], notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);

  const filteredAssets = assets.filter(a => !form.fromBase || a.base._id === form.fromBase);

  const handleAssetChange = (assetId) => {
    const asset = assets.find(a => a._id === assetId);
    setSelectedAsset(asset);
    setForm(f => ({ ...f, asset: assetId, equipmentType: asset?.equipmentType || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await API.post('/transfers', form);
      onSuccess();
    } catch (err) { setError(err.response?.data?.message || 'Transfer failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-military-800 border border-military-500 rounded-xl w-full max-w-lg mx-4 fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-military-700">
          <h2 className="font-mono font-bold text-khaki-300 uppercase tracking-widest">INITIATE TRANSFER</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-900/50 border border-red-700 text-red-300 rounded px-4 py-2 text-sm font-mono">⚠ {error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">From Base</label>
              <select className="select" value={form.fromBase} onChange={e => setForm(f => ({ ...f, fromBase: e.target.value, asset: '' }))} required>
                <option value="">Select Source</option>
                {bases.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">To Base</label>
              <select className="select" value={form.toBase} onChange={e => setForm(f => ({ ...f, toBase: e.target.value }))} required>
                <option value="">Select Destination</option>
                {bases.filter(b => b._id !== form.fromBase).map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
          </div>
          {/* Transfer visual */}
          {form.fromBase && form.toBase && (
            <div className="flex items-center justify-center gap-3 py-2 bg-military-700 rounded-lg text-sm font-mono">
              <span className="text-military-200">{bases.find(b => b._id === form.fromBase)?.name}</span>
              <span className="text-khaki-300 text-lg">→</span>
              <span className="text-military-200">{bases.find(b => b._id === form.toBase)?.name}</span>
            </div>
          )}
          <div>
            <label className="label">Asset</label>
            <select className="select" value={form.asset} onChange={e => handleAssetChange(e.target.value)} required>
              <option value="">Select Asset</option>
              {filteredAssets.map(a => <option key={a._id} value={a._id}>{a.name} (Balance: {a.currentBalance})</option>)}
            </select>
          </div>
          {selectedAsset && (
            <div className="bg-military-700 rounded px-3 py-2 text-xs font-mono text-military-300">
              Current Balance: <span className="text-khaki-300 font-bold">{selectedAsset.currentBalance} {selectedAsset.unit}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Quantity</label>
              <input className="input" type="number" min="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Transfer Date</label>
              <input className="input" type="date" value={form.transferDate} onChange={e => setForm(f => ({ ...f, transferDate: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? 'Processing...' : '⇄ Execute Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', baseId: '', equipmentType: '', direction: '' });
  const { isAdmin, isLogistics } = useAuth();
  const canCreate = isAdmin || isLogistics;

  const fetchTransfers = () => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    API.get('/transfers', { params }).then(r => setTransfers(r.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    API.get('/bases').then(r => setBases(r.data.data));
    API.get('/assets').then(r => setAssets(r.data.data));
  }, []);

  useEffect(() => { fetchTransfers(); }, [filters]);

  const statusColors = { completed: 'text-green-400', in_transit: 'text-yellow-400', pending: 'text-blue-400', cancelled: 'text-red-400' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono text-military-100 uppercase tracking-widest">TRANSFERS</h1>
          <p className="text-military-400 text-sm font-mono">Asset movement between bases</p>
        </div>
        {canCreate && <button className="btn-primary" onClick={() => setShowModal(true)}>⇄ New Transfer</button>}
      </div>

      <div className="card">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div><label className="label">From Date</label><input type="date" className="input" value={filters.startDate} onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))} /></div>
          <div><label className="label">To Date</label><input type="date" className="input" value={filters.endDate} onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))} /></div>
          <div>
            <label className="label">Base</label>
            <select className="select" value={filters.baseId} onChange={e => setFilters(f => ({ ...f, baseId: e.target.value }))}>
              <option value="">All Bases</option>
              {bases.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Direction</label>
            <select className="select" value={filters.direction} onChange={e => setFilters(f => ({ ...f, direction: e.target.value }))}>
              <option value="">Both</option>
              <option value="in">Incoming</option>
              <option value="out">Outgoing</option>
            </select>
          </div>
          <div>
            <label className="label">Equipment Type</label>
            <select className="select" value={filters.equipmentType} onChange={e => setFilters(f => ({ ...f, equipmentType: e.target.value }))}>
              <option value="">All Types</option>
              {['vehicle', 'weapon', 'ammunition', 'equipment'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs text-military-400 uppercase tracking-widest">Transfer History</span>
          <span className="font-mono text-xs text-khaki-300">{transfers.length} records</span>
        </div>
        {loading ? (
          <div className="text-center text-military-400 font-mono py-12">LOADING...</div>
        ) : transfers.length === 0 ? (
          <div className="text-center text-military-400 font-mono py-12">NO TRANSFER RECORDS FOUND</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-military-400 text-xs font-mono uppercase tracking-wider border-b border-military-700">
                {['Asset', 'From', 'To', 'Type', 'Qty', 'Status', 'Date', 'Authorized By'].map(h => (
                  <th key={h} className="pb-3 px-2 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transfers.map(t => (
                <tr key={t._id} className="table-row">
                  <td className="py-3 px-2 text-gray-200 font-semibold">{t.asset?.name}</td>
                  <td className="py-3 px-2 text-red-400 font-mono text-xs">{t.fromBase?.name}</td>
                  <td className="py-3 px-2 text-green-400 font-mono text-xs">{t.toBase?.name}</td>
                  <td className="py-3 px-2"><span className={`tag-${t.equipmentType}`}>{t.equipmentType}</span></td>
                  <td className="py-3 px-2 font-mono text-khaki-300 font-bold">{t.quantity?.toLocaleString()}</td>
                  <td className={`py-3 px-2 font-mono text-xs uppercase ${statusColors[t.status]}`}>{t.status}</td>
                  <td className="py-3 px-2 font-mono text-xs text-gray-400">{new Date(t.transferDate).toLocaleDateString()}</td>
                  <td className="py-3 px-2 text-gray-400 text-xs">{t.authorizedBy?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <TransferModal bases={bases} assets={assets} onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchTransfers(); API.get('/assets').then(r => setAssets(r.data.data)); }} />
      )}
    </div>
  );
}
