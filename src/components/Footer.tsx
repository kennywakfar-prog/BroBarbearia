import React from 'react';
import { MapPin, Clock, Phone, Scissors } from 'lucide-react';
import { BroLogo } from './BroLogo';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer id="localizacao" className="w-full bg-black border-t border-zinc-900 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <BroLogo size="sm" showSubtitle={true} className="items-start" />
            <p className="text-zinc-500 text-xs leading-relaxed mt-2">
              Tradição, precisão e acabamento impecável em um ambiente contemporâneo de alto impacto.
            </p>
          </div>

          {/* Col 2: Endereço */}
          <div className="space-y-2">
            <h4 className="font-display font-bold uppercase tracking-wider text-zinc-200 text-xs flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              Unidade Augusta
            </h4>
            <p className="text-zinc-400 leading-relaxed">
              Rua Augusta, 1420<br />
              Consolação, São Paulo - SP<br />
              CEP: 01304-001
            </p>
          </div>

          {/* Col 3: Horários */}
          <div className="space-y-2">
            <h4 className="font-display font-bold uppercase tracking-wider text-zinc-200 text-xs flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              Funcionamento
            </h4>
            <p className="text-zinc-400 leading-relaxed">
              Segunda a Sábado: <strong className="text-zinc-300">09:00 - 20:00</strong><br />
              Domingos & Feriados: <span className="text-zinc-400">Fechado</span>
            </p>
          </div>

          {/* Col 4: Acesso Rápido */}
          <div className="space-y-2.5">
            <h4 className="font-display font-bold uppercase tracking-wider text-zinc-200 text-xs">
              Área do Profissional
            </h4>
            <p className="text-zinc-400 leading-relaxed">
              Acesso restrito para barbeiros consultarem suas agendas e gerenciarem vagas.
            </p>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Scissors className="w-3 h-3 text-zinc-400" />
              <span>Entrar na Área do Barbeiro</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div>
            © {new Date().getFullYear()} BRO Barbearia. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span>Sistema 100% Client-Side</span>
            <span>·</span>
            <span>Persistência LocalStorage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
