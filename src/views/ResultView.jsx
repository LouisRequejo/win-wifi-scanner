import React from 'react';
import { 
  Send, 
  Gift, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  FileCode2,
  Loader2,
  Info
} from 'lucide-react';
import { useApp } from '../context/useApp';

export default function ResultView() {
  const {
    measurements,
    routerRoomId,
    clientData,
    setClientData,
    isSubmitting,
    submitFinalReport,
    setShowContractModal
  } = useApp();

  // Estadísticas del diagnóstico
  const criticalRooms = measurements.filter((m) => m.quality?.level === 'poor');
  const moderateRooms = measurements.filter((m) => m.quality?.level === 'moderate');

  const hasDeadZones = criticalRooms.length > 0;
  const hasAtenuation = moderateRooms.length > 0;

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-4rem)] p-5 max-w-md mx-auto animate-in fade-in duration-300">
      <div className="space-y-4">
        {/* Header Title */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold mb-1.5">
            <Flame className="w-3.5 h-3.5" /> Mapa de Cobertura Final
          </div>
          <h1 className="text-2xl font-black text-white leading-tight">
            Diagnóstico de tu Hogar
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Evaluación completa de {measurements.length} ambientes en tu casa.
          </p>
        </div>

        {/* Global Verdict Card */}
        <div className={`p-4 rounded-2xl border space-y-2 shadow-xl ${
          hasDeadZones 
            ? 'bg-rose-950/30 border-rose-500/40 text-rose-200' 
            : hasAtenuation 
            ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
            : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            {hasDeadZones ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : hasAtenuation ? (
              <Info className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <h2 className="font-bold text-sm text-white">
              {hasDeadZones 
                ? `Detectamos ${criticalRooms.length} Zona(s) Muerta(s) en tu casa`
                : hasAtenuation
                ? `Tu Wi-Fi pierde fuerza en ${moderateRooms.length} ambiente(s)`
                : '¡Excelente cobertura Wi-Fi en toda tu casa!'}
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {hasDeadZones
              ? 'Tu internet de WIN llega a máxima velocidad cerca del router, pero las paredes y la distancia bloquean la señal en los ambientes más alejados.'
              : hasAtenuation
              ? 'La señal sufre caídas intermitentes por obstáculos físicos. Es un problema de propagación en el hogar, no de la fibra óptica exterior.'
              : 'Todas las habitaciones medidas reciben señal fluida y estable para streaming 4K y gaming sin cortes.'}
          </p>
        </div>

        {/* Heatmap List Room by Room */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Detalle por Habitación
          </span>
          <div className="space-y-2">
            {measurements.map((m) => {
              const isRouter = m.id === routerRoomId;
              return (
                <div
                  key={m.id}
                  className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{m.name}</span>
                        {isRouter && (
                          <span className="text-[9px] bg-orange-500/20 text-orange-400 px-1.5 py-0.2 rounded font-bold">
                            Router
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                        {m.quality?.humanTitle} · {m.speed} Mbps
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className="text-xs font-black px-2.5 py-1 rounded-lg inline-block"
                      style={{
                        backgroundColor: `${m.quality?.color}20`,
                        color: m.quality?.color
                      }}
                    >
                      {m.quality?.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commercial Incentive / What does the user win? (Explicit requirement from Hackathon) */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-950/60 via-slate-900 to-amber-950/40 border border-orange-500/50 space-y-3 shadow-2xl relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 shrink-0">
              <Gift className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
                  Beneficio Exclusivo WIN
                </span>
              </div>
              <h3 className="text-sm font-black text-white mt-1">
                {hasDeadZones
                  ? '🎁 30% Dscto. en Sistema WIN Mesh + Instalación Prioritaria'
                  : '🎁 Atención Técnica Express en 10 Minutos'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {hasDeadZones
                  ? 'Al enviar este diagnóstico, un asesor de WIN te activará la solución de cobertura garantizada para eliminar las zonas muertas de tu casa.'
                  : 'Registramos la salud de tu red en nuestro sistema central para priorizar tus futuras consultas de soporte técnico.'}
              </p>
            </div>
          </div>

          {/* Quick contact confirmation */}
          <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Confirma tu celular para recibir el beneficio"
              value={clientData.telefono}
              onChange={(e) => setClientData({ ...clientData, telefono: e.target.value })}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-6 pb-2 space-y-2">
        <button
          onClick={submitFinalReport}
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-base shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 group transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Conectando con Servidores WIN...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              <span>Enviar Reporte a WIN con 1 Clic</span>
            </>
          )}
        </button>

        <button
          onClick={() => setShowContractModal(true)}
          className="w-full py-2 text-center text-xs text-slate-400 hover:text-orange-400 transition-colors flex items-center justify-center gap-1.5"
        >
          <FileCode2 className="w-3.5 h-3.5 text-orange-400" />
          <span>Ver Contrato de Datos (Evaluación Jurado)</span>
        </button>
      </div>
    </div>
  );
}
