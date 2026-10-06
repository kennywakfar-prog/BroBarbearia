import React from 'react';
import { Service } from '../types';
import { Check, Clock } from 'lucide-react';

interface ServiceSelectorProps {
  services: Service[];
  selectedServiceIds: string[];
  onToggleService: (serviceId: string) => void;
  totalPrice: number;
  totalDurationMin: number;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedServiceIds,
  onToggleService,
  totalPrice,
  totalDurationMin
}) => {
  return (
    <div id="servicos" className="space-y-4">
      {/* Header for client */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <span className="text-[10px] font-mono-num uppercase tracking-widest text-zinc-400 block mb-1">
            Passo 2 de 4
          </span>
          <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
            Escolha seu Plano ou Serviço
          </h2>
        </div>

        <p className="text-xs text-zinc-400 max-w-sm">
          Selecione o corte, barba ou combo desejado. O tempo e o valor são calculados na hora.
        </p>
      </div>

      {/* Services Grid or Client Clean State */}
      {services.length === 0 ? (
        <div className="p-8 sm:p-12 bg-zinc-950/80 border border-zinc-800 rounded-sm text-center space-y-2 backdrop-blur-md">
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <Clock className="w-5 h-5 text-zinc-400" />
          </div>
          
          <h3 className="font-display font-bold text-sm text-white uppercase tracking-tight">
            Catálogo de Serviços em Atualização
          </h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            A barbearia está atualizando os planos e serviços disponíveis. Em instantes o catálogo estará liberado para agendamentos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-2">
          {services.map((service) => {
            const isSelected = selectedServiceIds.includes(service.id);

            return (
              <div
                key={service.id}
                onClick={() => onToggleService(service.id)}
                className={`relative cursor-pointer p-4 sm:p-5 rounded-sm border transition-all duration-150 active:scale-[0.99] flex flex-col justify-between backdrop-blur-md ${
                  isSelected
                    ? 'bg-zinc-900/95 border-white ring-1 ring-white shadow-xl shadow-white/10'
                    : 'bg-zinc-950/80 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900/60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-sm flex items-center justify-center border transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-white text-black border-white shadow-sm'
                          : 'border-zinc-700 bg-zinc-900 text-transparent'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <h3 className="font-display font-bold text-sm sm:text-base text-white">
                        {service.name}
                      </h3>
                    </div>
                    {service.popular && (
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-zinc-850 text-zinc-200 border border-zinc-700 rounded-sm shrink-0">
                        Popular
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed pl-7.5 mb-3">
                    {service.description}
                  </p>

                  {/* O Jeito do Combo - Itens Inclusos visíveis para o cliente saber o que recebe */}
                  {service.includes && service.includes.length > 0 && (
                    <div className="pl-7.5 mb-3 flex flex-wrap gap-1">
                      {service.includes.map((inc) => (
                        <span
                          key={inc}
                          className="text-[10px] px-2 py-0.5 bg-zinc-900/90 text-zinc-300 border border-zinc-800 rounded-sm"
                        >
                          ✓ {inc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price and Duration */}
                <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between pl-7.5 text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="font-mono-num">{service.durationMin} min</span>
                  </div>
                  <div className="text-right">
                    {service.price > 0 ? (
                      <span className="font-mono-num font-bold text-sm sm:text-base text-white">
                        R$ {service.price.toFixed(2).replace('.', ',')}
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-zinc-400 italic">
                        Gratuito
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Real-time calculated summary bar */}
      {services.length > 0 && (
        <div className="mt-4 p-4 rounded-sm bg-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${selectedServiceIds.length > 0 ? 'bg-emerald-400' : 'bg-zinc-600'}`}></div>
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              {selectedServiceIds.length === 0
                ? 'Nenhum serviço selecionado ainda'
                : `${selectedServiceIds.length} ${selectedServiceIds.length === 1 ? 'serviço selecionado' : 'serviços selecionados'}`}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Tempo Estimado:</span>
              <span className="font-mono-num font-bold text-sm text-zinc-200">
                {totalDurationMin > 0 ? `${totalDurationMin} min` : '--'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Total:</span>
              {totalPrice > 0 ? (
                <span className="font-mono-num font-black text-lg text-white">
                  R$ {totalPrice.toFixed(2).replace('.', ',')}
                </span>
              ) : (
                <span className="text-xs text-zinc-400 font-medium italic">
                  {selectedServiceIds.length > 0 ? 'R$ 0,00' : 'Selecione um serviço'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
