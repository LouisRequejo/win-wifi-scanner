import React, { useState } from 'react';
import { AppContext } from './context';
import { buildDataContract, sendDiagnosisReport } from '../services/apiService';

const INITIAL_ROOMS = [
  { id: 'sala', name: 'Sala Principal', icon: '🛋️', defaultRouter: true },
  { id: 'dorm1', name: 'Dormitorio Principal', icon: '🛏️', defaultRouter: false },
  { id: 'dorm2', name: 'Dormitorio 2 / Estudio', icon: '💻', defaultRouter: false },
  { id: 'cocina', name: 'Cocina', icon: '🍳', defaultRouter: false },
  { id: 'segundo_piso', name: 'Segundo Piso', icon: '🪜', defaultRouter: false },
  { id: 'patio', name: 'Patio / Terraza', icon: '🌿', defaultRouter: false },
];

export function AppProvider({ children }) {
  const [step, setStep] = useState('WELCOME'); // WELCOME, ROOM_SELECT, MEASURE, RESULTS, SUCCESS
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [selectedRoomIds, setSelectedRoomIds] = useState(['sala', 'dorm1', 'cocina', 'segundo_piso']);
  const [routerRoomId, setRouterRoomId] = useState('sala');
  
  // Mediciones registradas: [{ id, name, icon, ping, jitter, speed, quality, timestamp }]
  const [measurements, setMeasurements] = useState([]);
  const [currentMeasuringIndex, setCurrentMeasuringIndex] = useState(0);

  // Datos de contacto/cliente
  const [clientData, setClientData] = useState({
    telefono: '',
    codigoCliente: '',
    esClienteWin: true
  });

  // Estado de envío
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Modal para que el jurado examine el contrato de datos
  const [showContractModal, setShowContractModal] = useState(false);

  // Acciones
  const toggleRoom = (id) => {
    setSelectedRoomIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev;
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const addCustomRoom = (name) => {
    if (!name.trim()) return;
    const newId = 'custom_' + Date.now();
    const newRoom = { id: newId, name: name.trim(), icon: '📍', defaultRouter: false };
    setRooms((prev) => [...prev, newRoom]);
    setSelectedRoomIds((prev) => [...prev, newId]);
  };

  const startMeasuringFlow = () => {
    setMeasurements([]);
    setCurrentMeasuringIndex(0);
    setStep('MEASURE');
  };

  const recordMeasurement = (roomMeasurement) => {
    setMeasurements((prev) => {
      const filtered = prev.filter((m) => m.id !== roomMeasurement.id);
      return [...filtered, roomMeasurement];
    });
  };

  const proceedToNextRoomOrResults = () => {
    const nextIdx = currentMeasuringIndex + 1;
    if (nextIdx < selectedRoomIds.length) {
      setCurrentMeasuringIndex(nextIdx);
    } else {
      setStep('RESULTS');
    }
  };

  const submitFinalReport = async () => {
    setIsSubmitting(true);
    try {
      const payload = buildDataContract(clientData, measurements, routerRoomId);
      const res = await sendDiagnosisReport(payload);
      setSubmissionResult(res);
      setStep('SUCCESS');
    } catch (err) {
      console.error(err);
      alert('Hubo un inconveniente al enviar el reporte. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const restartAll = () => {
    setMeasurements([]);
    setCurrentMeasuringIndex(0);
    setSubmissionResult(null);
    setStep('WELCOME');
  };

  const selectedRoomsList = selectedRoomIds
    .map((id) => rooms.find((r) => r.id === id))
    .filter(Boolean);

  const currentRoom = selectedRoomsList[currentMeasuringIndex] || selectedRoomsList[0];

  const currentDataContract = buildDataContract(
    clientData,
    measurements.length > 0 ? measurements : [
      {
        id: 'ejemplo_sala',
        name: 'Sala (Ejemplo)',
        ping: 28,
        jitter: 3,
        speed: 180,
        timestamp: new Date().toISOString(),
        quality: { label: 'Excelente', level: 'excellent', score: 95, verdict: 'Óptima' }
      }
    ],
    routerRoomId
  );

  return (
    <AppContext.Provider
      value={{
        step,
        setStep,
        rooms,
        selectedRoomIds,
        toggleRoom,
        addCustomRoom,
        routerRoomId,
        setRouterRoomId,
        selectedRoomsList,
        currentRoom,
        currentMeasuringIndex,
        startMeasuringFlow,
        recordMeasurement,
        proceedToNextRoomOrResults,
        measurements,
        clientData,
        setClientData,
        isSubmitting,
        submissionResult,
        submitFinalReport,
        restartAll,
        showContractModal,
        setShowContractModal,
        currentDataContract
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
