import React, { useEffect } from 'react';
import { CheckCircle2, Ticket, Sparkles, RotateCcw, FileCode2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/useApp';

export default function SentSuccessView() {
  const { submissionResult, restartAll, setShowContractModal, measurements } = useApp();

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#fbbf24', '#38bdf8', '#34d399']
      });
    } catch {
      // Ignorar si el navegador bloquea canvas
    }
  }, []);

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-4rem)] p-5 max-w-md mx-auto animate-in zoom-in-95 duration-300">
      <div className="space-y-5 text-center pt-4">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            ¡Reporte Recibido por WIN!
          </span>
          <h1 className="text-2xl font-black text-white">
            Tu diagnóstico está en camino
          </h1>
          <p className="text-xs text-slate-300 max-w-xs mx-auto">
            El Centro de Operaciones de Red y el área de Experiencia del Cliente de WIN han registrado las métricas de tu hogar.
          </p>
        </div>

        {/* Ticket Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-slate-400">Código de Seguimiento:</span>
            </div>
            <span className="text-sm font-mono font-black text-orange-400">
              {submissionResult?.ticketId || 'WIN-849201'}
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Ambientes medidos:</span>
              <span className="font-bold text-white">{measurements.length} habitaciones</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Beneficio WIN:</span>
              <span className="font-bold text-emerald-400">
                {submissionResult?.meshEligible ? '30% Dscto. Mesh Activado' : 'Soporte Express Prioritario'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Canal de atención:</span>
              <span className="font-bold text-white">WhatsApp Oficial WIN</span>
            </div>
          </div>
        </div>

        {/* Next step notice */}
        <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl text-left flex gap-3 items-center">
          <Sparkles className="w-5 h-5 text-orange-400 shrink-0" />
          <p className="text-[11px] text-orange-200 leading-snug">
            Si tus métricas arrojaron zonas críticas, un asesor comercial te escribirá para coordinar la instalación de tu repetidor Mesh con descuento especial.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 pb-2 space-y-2">
        <button
          onClick={restartAll}
          className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Realizar otro diagnóstico</span>
        </button>

        <button
          onClick={() => setShowContractModal(true)}
          className="w-full py-2 text-center text-xs text-slate-400 hover:text-orange-400 transition-colors flex items-center justify-center gap-1.5"
        >
          <FileCode2 className="w-3.5 h-3.5 text-orange-400" />
          <span>Revisar Payload del Contrato de Datos</span>
        </button>
      </div>
    </div>
  );
}
