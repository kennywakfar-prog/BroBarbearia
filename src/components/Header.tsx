import React from 'react';
import { Lock } from 'lucide-react';
import { BroLogo } from './BroLogo';

interface HeaderProps {
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-black/95 backdrop-blur-md border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Zone with Official Logo */}
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-2 group focus:outline-none">
            <BroLogo size="sm" showSubtitle={true} className="transition-opacity group-hover:opacity-90" />
          </a>
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-zinc-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wide text-zinc-400">
              Agenda Aberta
            </span>
          </div>
        </div>

        {/* Clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-wider font-medium text-zinc-400">
          <a href="#barbeiros" className="hover:text-white transition-colors">Barbeiros</a>
          <a href="#servicos" className="hover:text-white transition-colors">Serviços</a>
          <a href="#horarios" className="hover:text-white transition-colors">Horários</a>
          <a href="#localizacao" className="hover:text-white transition-colors">Localização</a>
        </nav>

        {/* Discreet link to Barber Private Page */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAdmin}
            className="group flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hover:text-white bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-sm transition-all cursor-pointer"
            title="Acesso exclusivo para profissionais da barbearia"
          >
            <Lock className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            <span className="hidden sm:inline">Área do Barbeiro</span>
            <span className="sm:hidden">Barbeiro</span>
          </button>
        </div>
      </div>
    </header>
  );
};
