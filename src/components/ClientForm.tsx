import React from 'react';
import { User, Phone, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Barber, Service } from '../types';

interface ClientFormProps {
  clientName: string;
  setClientName: (name: string) => void;
  clientPhone: string;
  setClientPhone: (phone: string) => void;
  clientNotes: string;
  setClientNotes: (notes: string) => void;
  selectedBarber: Barber | undefined;
  selectedServices: Service[];
  selectedDate: string;
  selectedTime: string;
  totalPrice: number;
  totalDurationMin: number;
  onSubmitBooking: (e: React.FormEvent) => void;
  errorMessage: string | null;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  clientName,
  setClientName,
  clientPhone,
  setClientPhone,
  clientNotes,
  setClientNotes,
  selectedBarber,
  selectedServices,
  selectedDate,
  selectedTime,
  totalPrice,
  totalDurationMin,
  onSubmitBooking,
  errorMessage
}) => {
  // Brazilian Phone mask handler: (11) 98765-4321
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }

    setClientPhone(value);
  };

  // Format date display
  const formatDateBR = (isoDate: string) => {
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
  };

  const isFormValid =
    clientName.trim().length >= 3 &&
    clientPhone.replace(/\D/g, '').length >= 10 &&
    Boolean(selectedBarber) &&
    selectedServices.length > 0 &&
    Boolean(selectedDate) &&
    Boolean(selectedTime);

  return (
    <div id="confirmacao" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-800 pb-3">
        <div>
          <span className="text-[10px] font-mono-num uppercase tracking-widest text-zinc-400 block mb-1">
            Passo 4 de 4
          </span>
          <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
            Seus Dados & Confirmação
          </h2>
        </div>
        <p className="text-xs text-zinc-400 max-w-sm">
          Sem links externos ou redirecionamento. O comprovante é gerado instantaneamente no sistema.
        </p>
      </div>

      <form onSubmit={onSubmitBooking} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome do Cliente */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Nome Completo <span className="text-white">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="Ex: Carlos Albuquerque"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
              />
            </div>
          </div>

          {/* Telefone de Contato */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Telefone / WhatsApp <span className="text-white">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                placeholder="(11) 98765-4321"
                value={clientPhone}
                onChange={handlePhoneChange}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
              />
            </div>
            <p className="text-[11px] text-zinc-400">
              Utilizado exclusivamente para localização do seu agendamento no sistema.
            </p>
          </div>
        </div>

        {/* Observações do Cliente */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Observações e Preferências <span className="text-zinc-400 font-normal">(Opcional)</span>
          </label>
          <div className="relative">
            <textarea
              rows={3}
              placeholder="Ex: Preferência por degradê navalhado alto, pele sensível na barba, referências de estilo, ou se prefere atendimento em silêncio..."
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors resize-none"
            />
          </div>
        </div>

        {/* Error notification if any */}
        {errorMessage && (
          <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded-sm flex items-center gap-2.5 text-xs text-red-200">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Resumo Contíguo do Agendamento */}
        <div className="p-5 rounded-sm bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-mono-num uppercase tracking-wider text-zinc-400">
              Resumo do Atendimento
            </span>
            <span className="text-xs font-mono-num font-bold text-emerald-400">
              Pagamento no Estabelecimento
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-zinc-400 block mb-0.5">Barbeiro</span>
              <span className="font-semibold text-white">
                {selectedBarber ? selectedBarber.name : 'Não selecionado'}
              </span>
            </div>

            <div>
              <span className="text-zinc-400 block mb-0.5">Data & Horário</span>
              <span className="font-semibold text-white">
                {selectedDate ? formatDateBR(selectedDate) : '--'} às {selectedTime || '--'}
              </span>
            </div>

            <div>
              <span className="text-zinc-400 block mb-0.5">Duração Estimada</span>
              <span className="font-mono-num font-semibold text-white">
                {totalDurationMin > 0 ? `${totalDurationMin} minutos` : '--'}
              </span>
            </div>

            <div>
              <span className="text-zinc-400 block mb-0.5">Valor Total</span>
              {totalPrice > 0 ? (
                <span className="font-mono-num font-extrabold text-white text-sm">
                  R$ {totalPrice.toFixed(2).replace('.', ',')}
                </span>
              ) : (
                <span className="text-xs text-zinc-400 font-medium italic">
                  A definir no local
                </span>
              )}
            </div>
          </div>

          {selectedServices.length > 0 && (
            <div className="pt-2 text-xs border-t border-zinc-800/60">
              <span className="text-zinc-400 mr-2">Serviços escolhidos:</span>
              <span className="text-zinc-300 font-medium">
                {selectedServices.map((s) => s.name).join(' + ')}
              </span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full sm:w-auto px-8 py-4 rounded-sm font-display font-bold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2.5 ${
              isFormValid
                ? 'bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar Agendamento</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
