import React from 'react';
import { useApp } from './context/useApp';
import Navbar from './components/Navbar';
import DataContractModal from './components/DataContractModal';
import WelcomeView from './views/WelcomeView';
import RoomSelectorView from './views/RoomSelectorView';
import MeasureView from './views/MeasureView';
import ResultView from './views/ResultView';
import SentSuccessView from './views/SentSuccessView';

export default function App() {
  const { step, currentMeasuringIndex } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">
      <Navbar />
      
      <main className="flex-1 flex flex-col justify-center">
        {step === 'WELCOME' && <WelcomeView />}
        {step === 'ROOM_SELECT' && <RoomSelectorView />}
        {step === 'MEASURE' && <MeasureView key={currentMeasuringIndex} />}
        {step === 'RESULTS' && <ResultView />}
        {step === 'SUCCESS' && <SentSuccessView />}
      </main>

      <DataContractModal />
    </div>
  );
}
