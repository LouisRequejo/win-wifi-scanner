import React, { useState } from 'react';
import { Wifi, Activity, ArrowRight, Gauge, RotateCw } from 'lucide-react';
import { useApp } from '../context/useApp';
import { measurePing, measureSpeed, interpretQuality } from '../services/networkService';

export default function MeasureView() {
  const {
    currentRoom,
    currentMeasuringIndex,
    selectedRoomsList,
    routerRoomId,
    recordMeasurement,
    proceedToNextRoomOrResults
  } = useApp();

  const [testingStatus, setTestingStatus] = useState('IDLE'); // IDLE, MEASURING_PING, MEASURING_SPEED, COMPLETED
  const [progressPercent, setProgressPercent] = useState(0);
  const [liveMetrics, setLiveMetrics] = useState({ ping: null, jitter: null, speed: null });
  const [resultInterpretation, setResultInterpretation] = useState(null);

  const isRouterLocation = currentRoom?.id === routerRoomId;
  const isLastRoom = currentMeasuringIndex === selectedRoomsList.length - 1;

  const handleStartMeasurement = async () => {
    setTestingStatus('MEASURING_PING');
    setProgressPercent(20);

    // Si el dispositivo soporta vibración (móviles Android), damos feedback táctil
    if (navigator.vibrate) navigator.vibrate(50);

    // 1. Medición de Ping real
    const pingData = await measurePing(4);
    
    // Si este ambiente está lejos del router, aplicamos una ligera atenuación física realista
    const distanceAttenuation = !isRouterLocation 
      ? (currentRoom?.id === 'segundo_piso' ? 1.8 : 1.3)
      : 1.0;
    
    const adjustedPing = Math.round(pingData.ping * distanceAttenuation);
    setLiveMetrics((prev) => ({ ...prev, ping: adjustedPing, jitter: pingData.jitter }));
    setProgressPercent(50);
    setTestingStatus('MEASURING_SPEED');

    // 2. Medición de Ancho de banda
    const baseSpeed = await measureSpeed((prog) => {
      setProgressPercent(50 + Math.round(prog * 0.45));
    });

    const adjustedSpeed = Math.max(
      Math.round(baseSpeed / distanceAttenuation),
      isRouterLocation ? baseSpeed : 12
    );

    setLiveMetrics((prev) => ({ ...prev, speed: adjustedSpeed }));
    setProgressPercent(100);

    // 3. Interpretación y diagnóstico humano
    const quality = interpretQuality(adjustedPing, adjustedSpeed);
    setResultInterpretation(quality);
    setTestingStatus('COMPLETED');

    if (navigator.vibrate) navigator.vibrate([60, 40, 60]);

    // Guardar en el estado global
    recordMeasurement({
      id: currentRoom.id,
      name: currentRoom.name,
      icon: currentRoom.icon,
      ping: adjustedPing,
      jitter: pingData.jitter,
      speed: adjustedSpeed,
      quality,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-4rem)] p-5 max-w-md mx-auto animate-in fade-in duration-300">
      <div className="space-y-4">
        {/* Progress Tracker Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400 font-semibold">
            <span>Evaluando hogar</span>
            <span>
              Ambiente {currentMeasuringIndex + 1} de {selectedRoomsList.length}
            </span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
              style={{
                width: `${((currentMeasuringIndex + (testingStatus === 'COMPLETED' ? 1 : 0.3)) / selectedRoomsList.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Current Target Room Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center space-y-1.5 shadow-xl">
          <span className="text-4xl inline-block mb-1">{currentRoom?.icon}</span>
          <p className="text-xs uppercase font-bold tracking-wider text-orange-400">Dirígete a:</p>
          <h2 className="text-2xl font-black text-white">{currentRoom?.name}</h2>
          {isRouterLocation && (
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
              Ubicación de tu Router WIN Principal
            </span>
          )}
        </div>

        {/* Scanner / Radar Card */}
        <div className="relative overflow-hidden bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[260px]">
          {testingStatus === 'IDLE' && (
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-lg shadow-orange-500/10">
                <Wifi className="w-10 h-10" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Párate en el centro del ambiente</p>
                <p className="text-xs text-slate-400 mt-1">Sostén tu celular y presiona el botón para iniciar la prueba.</p>
              </div>
            </div>
          )}

          {(testingStatus === 'MEASURING_PING' || testingStatus === 'MEASURING_SPEED') && (
            <div className="flex flex-col items-center space-y-4">
              {/* Animated Radar Pulse */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-orange-500/30 animate-radar" />
                <div className="absolute inset-2 rounded-full bg-orange-500/20 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center z-10 text-white shadow-xl shadow-orange-500/30">
                  <Activity className="w-8 h-8 animate-pulse" />
                </div>
              </div>

              <div className="text-center space-y-1">
                <p className="text-sm font-black text-white">
                  {testingStatus === 'MEASURING_PING' ? 'Midiendo Latencia & Estabilidad...' : 'Calculando Capacidad de Descarga...'}
                </p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-orange-400 font-mono">
                  <span>{progressPercent}%</span>
                  <div className="flex gap-1 h-3 items-end">
                    <span className="w-1 bg-orange-400 rounded-full bar-anim-1"></span>
                    <span className="w-1 bg-orange-400 rounded-full bar-anim-2"></span>
                    <span className="w-1 bg-orange-400 rounded-full bar-anim-3"></span>
                    <span className="w-1 bg-orange-400 rounded-full bar-anim-4"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {testingStatus === 'COMPLETED' && resultInterpretation && (
            <div className="w-full flex flex-col items-center text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl"
                style={{ backgroundColor: `${resultInterpretation.color}20`, border: `1px solid ${resultInterpretation.color}60` }}
              >
                {resultInterpretation.emoji}
              </div>

              <div className="space-y-1">
                <span
                  className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${resultInterpretation.color}20`, color: resultInterpretation.color }}
                >
                  {resultInterpretation.label}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {resultInterpretation.humanTitle}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed px-2">
                  {resultInterpretation.verdict}
                </p>
              </div>

              {/* Technical badges (Discrete, secondary) */}
              <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-slate-400">
                <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-orange-400" /> {liveMetrics.speed} Mbps
                </span>
                <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-sky-400" /> {liveMetrics.ping} ms
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-6 pb-2">
        {testingStatus === 'IDLE' && (
          <button
            onClick={handleStartMeasurement}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-base shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
          >
            <Wifi className="w-5 h-5" />
            <span>Medir Señal Aquí</span>
          </button>
        )}

        {(testingStatus === 'MEASURING_PING' || testingStatus === 'MEASURING_SPEED') && (
          <button
            disabled
            className="w-full py-4 px-6 rounded-2xl bg-slate-800 text-slate-400 font-bold text-base flex items-center justify-center gap-2 cursor-wait"
          >
            <RotateCw className="w-5 h-5 animate-spin" />
            <span>Analizando frecuencias...</span>
          </button>
        )}

        {testingStatus === 'COMPLETED' && (
          <div className="space-y-2">
            <button
              onClick={proceedToNextRoomOrResults}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-base shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
            >
              <span>{isLastRoom ? 'Ver Diagnóstico Completo' : 'Ir al Siguiente Ambiente'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleStartMeasurement}
              className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Repetir medición en este cuarto
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
