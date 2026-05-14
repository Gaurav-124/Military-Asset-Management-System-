@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-military-900 text-gray-100 font-military;
  }
  * { scrollbar-width: thin; scrollbar-color: #2d5a34 #0a0f0d; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0a0f0d; }
  ::-webkit-scrollbar-thumb { background: #2d5a34; border-radius: 3px; }
}

@layer components {
  .card { @apply bg-military-800 border border-military-600 rounded-lg p-5; }
  .card-dark { @apply bg-military-900 border border-military-700 rounded-lg p-5; }
  .btn-primary { @apply bg-military-500 hover:bg-military-400 text-white font-semibold px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2; }
  .btn-secondary { @apply bg-military-700 hover:bg-military-600 text-gray-200 font-semibold px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2; }
  .btn-danger { @apply bg-red-800 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition-all; }
  .input { @apply bg-military-700 border border-military-500 text-gray-100 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-military-400 focus:border-transparent placeholder-gray-500; }
  .select { @apply bg-military-700 border border-military-500 text-gray-100 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-military-400 cursor-pointer; }
  .label { @apply block text-xs font-semibold text-khaki-300 uppercase tracking-widest mb-1; }
  .metric-card { @apply card flex flex-col gap-2 hover:border-military-400 transition-colors cursor-pointer; }
  .badge-admin { @apply bg-red-900 text-red-300 text-xs px-2 py-0.5 rounded-full font-mono uppercase tracking-wider; }
  .badge-commander { @apply bg-military-700 text-military-200 text-xs px-2 py-0.5 rounded-full font-mono uppercase tracking-wider; }
  .badge-logistics { @apply bg-khaki-800 text-khaki-300 text-xs px-2 py-0.5 rounded-full font-mono uppercase tracking-wider; }
  .table-row { @apply border-b border-military-700 hover:bg-military-700 transition-colors; }
  .tag-vehicle { @apply bg-blue-900 text-blue-300 text-xs px-2 py-0.5 rounded font-mono; }
  .tag-weapon { @apply bg-red-900 text-red-300 text-xs px-2 py-0.5 rounded font-mono; }
  .tag-ammunition { @apply bg-yellow-900 text-yellow-300 text-xs px-2 py-0.5 rounded font-mono; }
  .tag-equipment { @apply bg-purple-900 text-purple-300 text-xs px-2 py-0.5 rounded font-mono; }
}

.scanline {
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
  pointer-events: none;
}

@keyframes pulse-green { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.pulse-green { animation: pulse-green 2s ease-in-out infinite; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.fade-in { animation: fadeIn 0.3s ease-out; }
