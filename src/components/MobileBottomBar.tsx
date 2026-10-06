import React from 'react';
import { ArrowRight, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { Barber, Service } from '../types';

interface MobileBottomBarProps {
  selectedBarber: Barber | undefined;
  selectedServices: Service[];
  selectedDate: string;
  selectedTime: string;
  totalPrice: number;
  totalDurationMin: number;
  onProceed: () => void;
  canProceed: boolean;
  stepNumber: number;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  selectedBarber,
  selectedServices,
  selectedDate,
  selectedTime,
  totalPrice,
  totalDurationMin,
  onProceed,
  canProceed,
  stepNumber
}) => {
  if (selectedServices.length === 0) return null;

  // Format date shorthand "10/10"
  const dateShort = selectedDate ? `${selectedDate.split('-')[2]}/${selectedDate.split('-')[1]}` : '';

  return (
    <aside 
      aria-label="Resumo do agendamento"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/90 px-4 py-3 shadow-[0_-10px_25px_rgba(0,0,0,0.8)]"
    >
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        {/* Left: Summary text */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] truncate">
            <span className="font-semibold text-white truncate">
              {selectedBarber?.name.split(' ')[0] || 'Barbeiro'}
            </span>
            {selectedTime && (
              <>
                <span className="text-zinc-600">·</span>
                <span className="font-mono-num text-zinc-300 font-medium">
                  {dateShort} {selectedTime}
                </span>
              </>
            )}
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            {totalPrice > 0 ? (
              <span className="font-mono-num font-black text-white text-base leading-none">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            ) : (
              <span className="text-xs text-zinc-300 font-semibold leading-none">
                Valor a definir
              </span>
            )}
            <span className="text-[10px] text-zinc-500 font-mono-num">
              {totalDurationMin} min
            </span>
          </div>
        </div>

        {/* Right: Action button */}
        <button
          onClick={onProceed}
          className="px-4 py-2.5 bg-white text-black hover:bg-zinc-200 active:scale-95 font-display font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>
            {stepNumber < 4 ? 'Avançar' : 'Finalizar'}
          </span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </aside>
  );
};
