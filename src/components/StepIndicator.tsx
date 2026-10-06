import React from 'react';
import { User, Scissors, Calendar, CheckCircle } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  selectedBarberName?: string;
  servicesCount: number;
  selectedTime?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
  selectedBarberName,
  servicesCount,
  selectedTime
}) => {
  const steps = [
    { number: 1, label: 'Barbeiro', done: Boolean(selectedBarberName), targetId: 'barbeiros' },
    { number: 2, label: 'Serviços', done: servicesCount > 0, targetId: 'servicos' },
    { number: 3, label: 'Horário', done: Boolean(selectedTime), targetId: 'horarios' },
    { number: 4, label: 'Confirmar', done: false, targetId: 'confirmacao' }
  ];

  return (
    <div className="w-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 rounded-sm p-2 sm:p-2.5 my-4">
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isDone = step.done;

          return (
            <button
              key={step.number}
              onClick={() => onStepClick(step.number)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xs transition-all text-center cursor-pointer ${
                isActive
                  ? 'bg-zinc-800/90 text-white border border-zinc-600 shadow-sm'
                  : isDone
                  ? 'bg-zinc-900/50 text-zinc-300 hover:bg-zinc-900 border border-zinc-800/80'
                  : 'text-zinc-500 hover:text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-1 mb-0.5">
                <span className={`w-4 h-4 rounded-full text-[10px] font-mono-num font-bold flex items-center justify-center ${
                  isActive
                    ? 'bg-white text-black'
                    : isDone
                    ? 'bg-emerald-500 text-black'
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {step.number}
                </span>
              </div>
              <span className={`text-[10px] font-medium tracking-tight truncate max-w-full ${
                isActive ? 'text-white font-bold' : isDone ? 'text-zinc-300' : 'text-zinc-500'
              }`}>
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
