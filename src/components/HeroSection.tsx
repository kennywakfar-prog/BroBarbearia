import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { BroLogo } from './BroLogo';

interface HeroSectionProps {
  onStartBooking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartBooking }) => {
  return (
    <section className="relative w-full border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-black to-black overflow-hidden pt-10 pb-14 sm:py-16">
      {/* Subtle geometric grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a0a_1px,transparent_1px),linear-gradient(to_bottom,#27272a0a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          
          {/* Logo Showcase */}
          <div className="mb-6 inline-block">
            <BroLogo size="lg" showSubtitle={true} className="items-start" />
          </div>

          {/* Refined headline with smaller, balanced typography */}
          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug mb-3 text-balance">
            Agendamento Online · Precisão & Estilo
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal mb-6 max-w-xl">
            Escolha seu barbeiro, selecione os serviços desejados e garanta seu horário em instantes com confirmação e comprovante digital direto na tela.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onStartBooking}
              className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 font-display font-bold text-xs tracking-wider uppercase rounded-sm transition-all shadow-md flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              <Calendar className="w-3.5 h-3.5 text-black" />
              <span>Marcar Horário</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            
            <a
              href="#servicos"
              className="px-4 py-2.5 bg-transparent hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-600 font-display font-medium text-xs tracking-wider uppercase rounded-sm transition-all"
            >
              Ver Serviços
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-zinc-900 text-zinc-400">
            <div>
              <span className="font-mono-num text-lg font-bold text-white block">100%</span>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Digital & Sem Espera</span>
            </div>
            <div>
              <span className="font-mono-num text-lg font-bold text-white block">4.9 ★</span>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Avaliação dos Clientes</span>
            </div>
            <div>
              <span className="font-display text-lg font-bold text-white block">Equipe BRO</span>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Especialistas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
