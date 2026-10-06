import React from 'react';
import { Barber } from '../types';
import { UserCheck, Star, Award, CheckCircle2 } from 'lucide-react';

interface BarberSelectorProps {
  barbers: Barber[];
  selectedBarberId: string;
  onSelectBarber: (barberId: string) => void;
  getBarberAvailableSlotsCount: (barberId: string) => number;
}

export const BarberSelector: React.FC<BarberSelectorProps> = ({
  barbers,
  selectedBarberId,
  onSelectBarber,
  getBarberAvailableSlotsCount
}) => {
  return (
    <div id="barbeiros" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-800 pb-3">
        <div>
          <span className="text-[10px] font-mono-num uppercase tracking-widest text-zinc-400 block mb-1">
            Passo 1 de 4
          </span>
          <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
            Escolha seu Barbeiro
          </h2>
        </div>
        <p className="text-xs text-zinc-400 max-w-sm">
          A grade de horários é calculada e reservada de forma individual para cada profissional.
        </p>
      </div>

      {barbers.length === 0 ? (
        <div className="p-8 sm:p-12 bg-zinc-950/80 border border-zinc-800 rounded-sm text-center space-y-2 backdrop-blur-md">
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <UserCheck className="w-5 h-5 text-zinc-400" />
          </div>
          <h3 className="font-display font-bold text-sm text-white uppercase tracking-tight">
            Equipe em Atualização
          </h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            Nenhum barbeiro disponível para agendamento online no momento. Por favor, retorne em breve.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
          {barbers.map((barber) => {
          const isSelected = barber.id === selectedBarberId;
          const availableCount = getBarberAvailableSlotsCount(barber.id);

          return (
            <div
              key={barber.id}
              onClick={() => onSelectBarber(barber.id)}
              className={`relative cursor-pointer text-left p-4 sm:p-5 rounded-sm border transition-all duration-150 active:scale-[0.99] flex flex-col justify-between backdrop-blur-md ${
                isSelected
                  ? 'bg-zinc-900/95 border-white ring-1 ring-white shadow-xl shadow-white/10'
                  : 'bg-zinc-950/80 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900/60'
              }`}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-white bg-zinc-800 px-2 py-0.5 rounded border border-zinc-600 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                  <span>Selecionado</span>
                </div>
              )}

              <div>
                {/* Avatar Badge & Rating */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-sm flex items-center justify-center font-display font-black text-sm sm:text-base border transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-zinc-900 text-zinc-200 border-zinc-700'
                  }`}>
                    {barber.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-sm sm:text-base text-white leading-tight truncate">
                      {barber.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                      <Star className="w-3 h-3 text-white fill-white" />
                      <span className="font-mono-num font-semibold text-zinc-200">{barber.rating.toFixed(2)}</span>
                      <span className="text-zinc-500">({barber.reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Role & Bio */}
                <p className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  {barber.role}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-3">
                  {barber.bio}
                </p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {barber.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="text-[9px] sm:text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-zinc-900/90 text-zinc-400 border border-zinc-800 rounded"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Slot Availability Footer */}
              <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-400 text-[11px]">Vagas hoje:</span>
                <span className={`font-mono-num font-semibold px-2 py-0.5 rounded text-[11px] ${
                  availableCount > 0
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-900/80'
                    : 'text-zinc-500 bg-zinc-900 border border-zinc-800'
                }`}>
                  {availableCount} {availableCount === 1 ? 'vaga' : 'vagas'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
