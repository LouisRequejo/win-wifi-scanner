import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Smartphone, Sparkles, HelpCircle } from 'lucide-react';
import { useApp } from '../context/useApp';

export default function WelcomeView() {
  const { setStep, clientData, setClientData, setShowContractModal } = useApp();

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-4rem)] p-5 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Top Banner / Value Proposition */}
      <div className="w-full space-y-5 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Herramienta Oficial WIN · Sin Instalación</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-white leading-tight">
            Descubre la verdad de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">Wi-Fi en casa</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            ¿Sientes que el internet se pone lento en tu cuarto o segundo piso? Mide la señal habitación por habitación en solo 60 segundos con tu celular.
          </p>
        </div>

        {/* 3 Simple Steps */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 space-y-3 shadow-xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">¿Cómo funciona?</h2>
          
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-black shrink-0 border border-orange-500/30">
              1
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Elige tus habitaciones</p>
              <p className="text-[11px] text-slate-400">Marca los ambientes donde sueles usar internet (Sala, Cuarto, Cocina).</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-black shrink-0 border border-sky-500/30">
              2
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Camina y presiona 'Medir'</p>
              <p className="text-[11px] text-slate-400">Tu celular evaluará latencia y potencia real en cada lugar en 3 segundos.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black shrink-0 border border-emerald-500/30">
              3
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Obtén tu diagnóstico claro</p>
              <p className="text-[11px] text-slate-400">Sin términos técnicos complicados + beneficios exclusivos para tu hogar.</p>
            </div>
          </div>
        </div>

        {/* Optional Identifier Input (Zero Friction) */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
            <span>Tu teléfono o código de cliente (Opcional):</span>
            <span className="text-[10px] text-slate-400">Para vincular reporte</span>
          </label>
          <input
            type="text"
            placeholder="Ej. 987 654 321"
            value={clientData.telefono}
            onChange={(e) => setClientData({ ...clientData, telefono: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
          />
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-around py-1 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Sin instalar apps
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> 100% Seguro
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Toma 1 minuto
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="w-full pt-6 pb-2 space-y-3">
        <button
          onClick={() => setStep('ROOM_SELECT')}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-base shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 group transition-all transform active:scale-98 cursor-pointer"
        >
          <span>Comenzar Diagnóstico</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => setShowContractModal(true)}
          className="w-full text-center text-xs text-slate-400 hover:text-orange-400 transition-colors py-1 flex items-center justify-center gap-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>¿Eres miembro del Jurado? Ver Contrato de Datos aquí</span>
        </button>
      </div>
    </div>
  );
}
