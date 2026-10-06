import React, { useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, Lock, Check, AlertCircle } from 'lucide-react';
import { OPERATING_SLOTS, getFormattedDateString } from '../data/barbershopData';
import { TimeSlot } from '../types';

interface ScheduleGridProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  selectedTime: string;
  onSelectTime: (timeStr: string) => void;
  barberName: string;
  occupiedSlotsMap: Record<string, { clientName: string; serviceSummary?: string; isBlock?: boolean; blockReason?: string }>;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  barberName,
  occupiedSlotsMap
}) => {
  // Generate 14 days starting from today (blocks past dates)
  const availableDates = useMemo(() => {
    const list: { dateStr: string; dayNumber: number; weekDay: string; isToday: boolean; isTomorrow: boolean }[] = [];
    const today = new Date();
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      
      // Skip Sundays if barbershop is closed on Sunday (or include if desired, let's keep all operational days)
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0) continue; // Closed on Sundays

      const dateStr = getFormattedDateString(d);
      list.push({
        dateStr,
        dayNumber: d.getDate(),
        weekDay: weekDays[dayOfWeek],
        isToday: i === 0,
        isTomorrow: i === 1
      });
    }
    return list;
  }, []);

  const todayStr = useMemo(() => getFormattedDateString(new Date()), []);

  // Compute status for all slots of the day
  const slots: TimeSlot[] = useMemo(() => {
    const now = new Date();
    const isToday = selectedDate === todayStr;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return OPERATING_SLOTS.map((time) => {
      const occupiedInfo = occupiedSlotsMap[time];
      const [slotH, slotM] = time.split(':').map(Number);
      
      // Check if slot has already passed today
      const isPast = isToday && (slotH < currentHour || (slotH === currentHour && slotM <= currentMinute));
      const isOccupied = Boolean(occupiedInfo) || isPast;

      return {
        time,
        isOccupied,
        occupiedBy: isPast && !occupiedInfo ? { clientName: 'Horário Encerrado', blockReason: 'Passado' } : occupiedInfo,
        isPast
      };
    });
  }, [selectedDate, todayStr, occupiedSlotsMap]);

  // Counts
  const availableSlotsCount = slots.filter((s) => !s.isOccupied).length;
  const occupiedSlotsCount = slots.filter((s) => s.isOccupied).length;

  return (
    <div id="horarios" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-800 pb-3">
        <div>
          <span className="text-[10px] font-mono-num uppercase tracking-widest text-zinc-400 block mb-1">
            Passo 3 de 4
          </span>
          <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
            Data & Horário de Atendimento
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300">Agenda de:</span>
          <span className="px-2 py-0.5 bg-zinc-800 text-white rounded text-[11px] font-medium border border-zinc-700">
            {barberName}
          </span>
        </div>
      </div>

      {/* Date Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-semibold uppercase tracking-wider text-zinc-300">Escolha o Dia:</span>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-zinc-400">Ou escolha outra data:</span>
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value >= todayStr) {
                  onSelectDate(e.target.value);
                }
              }}
              className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs px-2 py-1 rounded cursor-pointer focus:outline-none focus:border-white"
            />
          </div>
        </div>

        {/* Quick Date horizontal buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x touch-pan-x">
          {availableDates.map((item) => {
            const isSelected = item.dateStr === selectedDate;

            return (
              <button
                key={item.dateStr}
                type="button"
                onClick={() => onSelectDate(item.dateStr)}
                className={`flex flex-col items-center justify-center min-w-[72px] sm:min-w-[76px] py-2.5 sm:py-3 px-2 rounded-sm border transition-all shrink-0 cursor-pointer snap-start active:scale-95 backdrop-blur-md ${
                  isSelected
                    ? 'bg-white text-black border-white ring-1 ring-white shadow-lg'
                    : 'bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <span className={`text-[10px] sm:text-[11px] uppercase font-bold tracking-wider ${isSelected ? 'text-zinc-800' : 'text-zinc-400'}`}>
                  {item.isToday ? 'Hoje' : item.isTomorrow ? 'Amanhã' : item.weekDay}
                </span>
                <span className="font-mono-num font-extrabold text-base sm:text-lg leading-tight mt-0.5">
                  {item.dayNumber}
                </span>
                <span className={`text-[9px] uppercase tracking-widest mt-0.5 ${isSelected ? 'text-zinc-600' : 'text-zinc-500'}`}>
                  {item.dateStr.split('-')[1]}/{item.dateStr.split('-')[2]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 text-xs">
        <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-xs bg-zinc-900 border border-zinc-700"></div>
            <span className="text-zinc-400">Livre</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-xs bg-white border border-white"></div>
            <span className="text-zinc-200 font-medium">Escolhido</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-xs bg-zinc-950 border border-zinc-800"></div>
            <span className="text-zinc-500">Ocupado</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono-num">
          <span className="text-emerald-400 font-medium">{availableSlotsCount} livres</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-500">{occupiedSlotsCount} ocupados</span>
        </div>
      </div>

      {/* Time Slots Grid (Lógica de Ocupação Crítica) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-2.5">
        {slots.map((slot) => {
          const isSelected = slot.time === selectedTime && !slot.isOccupied;

          if (slot.isOccupied) {
            const isBlock = slot.occupiedBy?.isBlock;
            const blockLabel = slot.occupiedBy?.blockReason || 'Ocupado';

            return (
              <div
                key={slot.time}
                aria-disabled="true"
                title={`Horário ${slot.time} está indisponível (${blockLabel})`}
                className="relative flex flex-col items-center justify-center min-h-[50px] py-2 px-1.5 rounded-sm bg-zinc-950/90 border border-zinc-900 text-zinc-600 cursor-not-allowed select-none opacity-60 backdrop-blur-sm"
              >
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-zinc-600" />
                  <span className="font-mono-num text-xs sm:text-sm line-through font-medium">
                    {slot.time}
                  </span>
                </div>
                <span className="text-[9px] font-semibold tracking-wider uppercase text-zinc-600 mt-0.5 truncate max-w-full px-1">
                  {isBlock ? blockLabel : 'Ocupado'}
                </span>
              </div>
            );
          }

          return (
            <button
              key={slot.time}
              type="button"
              onClick={() => onSelectTime(slot.time)}
              className={`relative flex flex-col items-center justify-center min-h-[50px] py-2 px-1.5 rounded-sm border transition-all duration-150 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white backdrop-blur-md ${
                isSelected
                  ? 'bg-white text-black border-white ring-2 ring-white shadow-xl font-bold'
                  : 'bg-zinc-900/90 text-zinc-100 border-zinc-700/80 hover:border-zinc-400 hover:bg-zinc-850 active:bg-zinc-800'
              }`}
            >
              <div className="flex items-center gap-1">
                <Clock className={`w-3 h-3 ${isSelected ? 'text-black' : 'text-zinc-400'}`} />
                <span className="font-mono-num text-xs sm:text-sm font-semibold tracking-wide">
                  {slot.time}
                </span>
              </div>
              <span className={`text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider mt-0.5 ${
                isSelected ? 'text-zinc-900 font-bold' : 'text-emerald-400'
              }`}>
                {isSelected ? 'Escolhido' : 'Disponível'}
              </span>
            </button>
          );
        })}
      </div>

      {availableSlotsCount === 0 && (
        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-sm flex items-center gap-3 text-zinc-400 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Não há mais horários disponíveis para este profissional nesta data. Por favor, escolha outra data ou selecione outro barbeiro da equipe.
          </span>
        </div>
      )}
    </div>
  );
};
