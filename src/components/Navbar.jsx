import React from 'react';
import { Wifi, FileCode2, RotateCcw } from 'lucide-react';
import { useApp } from '../context/useApp';

export default function Navbar() {
  const { step, setShowContractModal, restartAll } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-md mx-auto px-4 h-15 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={restartAll} 
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Wifi className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight text-lg text-white">WIN</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Wi-Fi Scan
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5">Diagnóstico Hogar · Reto 01</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Botón para que el jurado vea el Contrato de Datos requerido */}
          <button
            onClick={() => setShowContractModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-orange-500 transition-all shadow-sm"
            title="Ver Contrato de Datos oficial para el Jurado"
          >
            <FileCode2 className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Contrato Datos</span>
            <span className="sm:hidden">Datos</span>
          </button>

          {step !== 'WELCOME' && (
            <button
              onClick={restartAll}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Reiniciar diagnóstico"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
