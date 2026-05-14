import { useState, useEffect } from 'react';
import API from '../utils/api';

const ACTION_COLORS = {
  purchase: 'bg-green-900 text-green-300',
  transfer: 'bg-blue-900 text-blue-300',
  assignment: 'bg-purple-900 text-purple-300',
  expend: 'bg-red-900 text-red-300',
  login: 'bg-military-700 text-military-300',
  logout: 'bg-gray-800 text-gray-400',
  create: 'bg-teal-900 text-teal-300',
  update: 'bg-yellow-900 text-yellow-300',
  delete: 'bg-red-900 text-red-300',
};

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/audit-logs').then(r => setLogs(r.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-military-100 uppercase tracking-widest">AUDIT LOGS</h1>
        <p className="text-military-400 text-sm font-mono">System-wide transaction history — Admin access only</p>
      </div>

      <div className="card overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs text-military-400 uppercase tracking-widest">Activity Log</span>
          <span className="font-mono text-xs text-khaki-300">{logs.length} records</span>
        </div>
        {loading ? (
          <div className="text-center text-military-400 font-mono py-12">LOADING AUDIT TRAIL...</div>
        ) : logs.length === 0 ? (
          <div className="text-center text-military-400 font-mono py-12">NO AUDIT RECORDS</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-military-400 text-xs font-mono uppercase tracking-wider border-b border-military-700">
                {['Action', 'Entity', 'Performed By', 'Base', 'Details', 'Timestamp'].map(h => (
                  <th key={h} className="pb-3 px-2 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id} className="table-row">
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono uppercase ${ACTION_COLORS[log.action] || 'bg-gray-800 text-gray-400'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-military-300 font-mono text-xs">{log.entity}</td>
                  <td className="py-3 px-2 text-gray-200">{log.performedBy?.name || '—'}</td>
                  <td className="py-3 px-2 text-military-400 text-xs">{log.base?.name || '—'}</td>
                  <td className="py-3 px-2 text-gray-400 text-xs font-mono max-w-xs truncate">
                    {log.details ? JSON.stringify(log.details) : '—'}
                  </td>
                  <td className="py-3 px-2 font-mono text-xs text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
