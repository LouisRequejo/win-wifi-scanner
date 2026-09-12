import React, { useState } from 'react';
import { X, Check, Copy, Database, ShieldAlert, Cpu } from 'lucide-react';
import { useApp } from '../context/useApp';

export default function DataContractModal() {
  const { showContractModal, setShowContractModal, currentDataContract } = useApp();
  const [activeTab, setActiveTab] = useState('json'); // 'json', 'spec', 'adoption'
  const [copied, setCopied] = useState(false);

  if (!showContractModal) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(currentDataContract, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-none">Contrato de Datos Oficial</h3>
              <p className="text-xs text-slate-400 mt-1">Requisito Obligatorio · Reto 01 Hackatón WIN</p>
            </div>
          </div>
          <button
            onClick={() => setShowContractModal(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'json'
                ? 'border-orange-500 text-orange-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Payload JSON (En vivo)
          </button>
          <button
            onClick={() => setActiveTab('spec')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'spec'
                ? 'border-orange-500 text-orange-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Especificación de Campos
          </button>
          <button
            onClick={() => setActiveTab('adoption')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'adoption'
                ? 'border-orange-500 text-orange-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Ruta de Adopción WIN (Áreas)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-sm font-sans">
          {activeTab === 'json' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400">
                  Estructura enviada a la API de WIN al presionar "Enviar Reporte":
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar JSON'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] text-emerald-400 font-mono overflow-x-auto leading-relaxed">
                {JSON.stringify(currentDataContract, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'spec' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> 1. Campos que la App entrega a WIN (POST)
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong className="text-white">cliente_id:</strong> Teléfono o número de servicio (desde link con query param o input).</li>
                  <li><strong className="text-white">ambiente_router_principal:</strong> Habitación de referencia para calcular atenuación por distancia.</li>
                  <li><strong className="text-white">mediciones_detalle:</strong> Array con ping (ms), jitter (ms) y velocidad calculada por ambiente.</li>
                  <li><strong className="text-white">diagnostico_ux:</strong> Veredicto entendible y nivel (excellent, good, moderate, poor).</li>
                </ul>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Database className="w-4 h-4" /> 2. Campos requeridos de WIN en Producción
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong className="text-white">plan_contratado_mbps:</strong> Velocidad contratada en CRM para comparar velocidad real vs prometida.</li>
                  <li><strong className="text-white">modelo_ont_router:</strong> Saber si el cliente tiene Wi-Fi 5 o Wi-Fi 6 para calibrar límites.</li>
                </ul>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> 3. ¿Qué pasa si WIN no tiene estos datos? (Fallback)
                </h4>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  La Web App es <strong className="text-white">100% resiliente y autosuficiente</strong>. Si WIN no expone sus APIs, la app evalúa la calidad en base a umbrales empíricos universales (streaming 4K, teletrabajo, juegos) sin romper la experiencia del cliente.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'adoption' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">Área Dueña: AVERÍAS & SOPORTE TÉCNICO</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">Inmediato</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong className="text-orange-400">Impacto:</strong> Filtra el 60% de falsos reportes de avería. Cuando un cliente llama por "lentitud", el bot de WhatsApp o el asesor le envía este enlace. Si el reporte muestra "Zona Muerta" por distancia, se evita el envío innecesario de una cuadrilla técnica a domicilio.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">Área: EXPERIENCIA DEL CLIENTE (CX)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold">Fase 1</span>
                </div>
                <p className="text-xs text-slate-300">
                  El cliente siente control y transparencia. Recibe feedback inmediato sin esperar 45 minutos en línea telefónica.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">Área: VENTAS & PRODUCTO (Cross-Selling)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">Fase 2</span>
                </div>
                <p className="text-xs text-slate-300">
                  Convierte una queja en una oportunidad de venta de <strong>WIN Mesh</strong>. El cliente ve con sus propios ojos la zona roja en su segundo piso y acepta la oferta con 1 clic.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={() => setShowContractModal(false)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-all shadow-lg shadow-orange-500/20"
          >
            Entendido · Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
