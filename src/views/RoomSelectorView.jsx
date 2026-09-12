import React, { useState } from 'react';
import { Check, Plus, Radio, ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { useApp } from '../context/useApp';

export default function RoomSelectorView() {
  const {
    rooms,
    selectedRoomIds,
    toggleRoom,
    routerRoomId,
    setRouterRoomId,
    addCustomRoom,
    startMeasuringFlow,
    setStep
  } = useApp();

  const [newRoomName, setNewRoomName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      addCustomRoom(newRoomName);
      setNewRoomName('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-4rem)] p-5 max-w-md mx-auto animate-in fade-in duration-200">
      <div className="space-y-5">
        {/* Header with Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep('WELCOME')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">Configura tu Hogar</h1>
            <p className="text-xs text-slate-400">Paso 1: Selecciona las zonas a evaluar</p>
          </div>
        </div>

        {/* Router Location Question (Crucial for diagnosis) */}
        <div className="p-3.5 bg-gradient-to-r from-orange-950/40 to-slate-900/80 border border-orange-500/30 rounded-2xl space-y-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-orange-200">¿Dónde está ubicado tu router WIN principal?</span>
          </div>
          <select
            value={routerRoomId}
            onChange={(e) => setRouterRoomId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-orange-500"
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.icon} {room.name}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-400">
            Esto permite a la IA calcular la atenuación de señal provocada por las paredes de tu casa.
          </p>
        </div>

        {/* Room Selection Grid */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ambientes a medir ({selectedRoomIds.length})
            </span>
            <button
              onClick={() => setShowAddModal(!showAddModal)}
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar otro
            </button>
          </div>

          {/* Form to add custom room if active */}
          {showAddModal && (
            <form onSubmit={handleAddCustom} className="p-3 bg-slate-900 border border-slate-700 rounded-xl flex gap-2">
              <input
                type="text"
                placeholder="Nombre del ambiente (ej. Azotea)"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                autoFocus
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-orange-600 text-white text-xs font-bold rounded-lg hover:bg-orange-500"
              >
                Añadir
              </button>
            </form>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            {rooms.map((room) => {
              const isSelected = selectedRoomIds.includes(room.id);
              const isRouter = room.id === routerRoomId;

              return (
                <div
                  key={room.id}
                  onClick={() => toggleRoom(room.id)}
                  className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between min-h-[90px] ${
                    isSelected
                      ? 'bg-slate-900/90 border-orange-500/60 shadow-lg shadow-orange-500/10'
                      : 'bg-slate-950/50 border-slate-800 text-slate-500 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-2xl">{room.icon}</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-orange-500 border-orange-400 text-white'
                          : 'border-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                      {room.name}
                    </p>
                    {isRouter && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-orange-400 mt-0.5">
                        <MapPin className="w-2.5 h-2.5" /> Router WIN
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer / Continue button */}
      <div className="pt-6 pb-2">
        <button
          onClick={startMeasuringFlow}
          disabled={selectedRoomIds.length === 0}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-base shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 group transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
        >
          <span>Comenzar Recorrido ({selectedRoomIds.length} zonas)</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
