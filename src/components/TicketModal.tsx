import React, { useState } from 'react';
import { Appointment } from '../types';
import { CheckCircle, Copy, Check, Calendar, Download, Printer, X, Scissors, Clock, MapPin, User, Phone, Sparkles, MessageCircle } from 'lucide-react';
import { BroLogo } from './BroLogo';

interface TicketModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ appointment, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!appointment) return null;

  // Format date: "Sábado, 10 de Outubro de 2026"
  const formatDateExtended = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Copy text summary to clipboard
  const handleCopySummary = () => {
    const text = `💈 BRO BARBEARIA - COMPROVANTE DE AGENDAMENTO
Código: #${appointment.id}
Cliente: ${appointment.clientName}
Barbeiro: ${appointment.barberName}
Data: ${formatDateExtended(appointment.date)}
Horário: ${appointment.time}
Serviços: ${appointment.serviceNames.join(' + ')}
Duração: ${appointment.totalDurationMin} min
Valor Total: R$ ${appointment.totalPrice.toFixed(2).replace('.', ',')}
Local: Rua Augusta, 1420 - Consolação, São Paulo - SP
Observações: ${appointment.clientNotes || 'Nenhuma'}
*Apresente este código na recepção. Pagamento realizado no local.*`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Generate downloadable .ics calendar file
  const handleDownloadICS = () => {
    const [year, month, day] = appointment.date.split('-');
    const [hour, minute] = appointment.time.split('-');
    const startDate = `${year}${month}${day}T${appointment.time.replace(':', '')}00`;
    
    // Calculate end time
    const [h, m] = appointment.time.split(':').map(Number);
    const endMinutesTotal = h * 60 + m + appointment.totalDurationMin;
    const endH = String(Math.floor(endMinutesTotal / 60)).padStart(2, '0');
    const endM = String(endMinutesTotal % 60).padStart(2, '0');
    const endDate = `${year}${month}${day}T${endH}${endM}00`;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BRO Barbearia//Agendamento//PT
BEGIN:VEVENT
UID:${appointment.id}@brobarbearia.com.br
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:BRO Barbearia - ${appointment.serviceNames.join(' + ')} com ${appointment.barberName}
DESCRIPTION:Agendamento #${appointment.id}\\nBarbeiro: ${appointment.barberName}\\nServiço: ${appointment.serviceNames.join(' + ')}\\nCliente: ${appointment.clientName}\\nObservações: ${appointment.clientNotes || 'Nenhuma'}
LOCATION:Rua Augusta, 1420 - Consolação, São Paulo - SP
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `agendamento_${appointment.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNotifyBarbershopWhatsApp = () => {
    const shopPhone = '5511987214321';
    const msg = `Olá, equipe BRO Barbearia! 💈\n\nAcabei de realizar o agendamento #${appointment.id} pelo site:\n👤 Cliente: ${appointment.clientName} (${appointment.clientPhone})\n✂️ Barbeiro: ${appointment.barberName}\n📅 Data: ${appointment.date} às ${appointment.time}\n💈 Serviços: ${appointment.serviceNames.join(' + ')}\n💰 Total: R$ ${appointment.totalPrice.toFixed(2).replace('.', ',')}\n${appointment.clientNotes ? `Obs: "${appointment.clientNotes}"\n` : ''}\nFavor confirmar o recebimento!`;
    window.open(`https://api.whatsapp.com/send?phone=${shopPhone}&text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-sm shadow-2xl text-zinc-100 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-black border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <BroLogo size="sm" showSubtitle={false} />
            <div className="border-l border-zinc-800 pl-3">
              <span className="font-display font-semibold text-xs tracking-tight text-white block">
                BRO BARBEARIA
              </span>
              <span className="text-[10px] font-mono-num uppercase tracking-wider text-zinc-400">
                Ticket Digital de Atendimento
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-sm transition-colors cursor-pointer"
            title="Fechar comprovante"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voucher Main Body */}
        <div className="p-6 space-y-6">
          {/* Success Banner */}
          <div className="flex items-center gap-3 p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-sm">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Agendamento Confirmado com Sucesso!
              </h4>
              <p className="text-[11px] text-zinc-400">
                Seu horário está gravado no sistema e bloqueado na agenda do barbeiro.
              </p>
            </div>
          </div>

          {/* Luxury Ticket Card */}
          <div className="relative bg-black border border-zinc-700/80 rounded-sm p-6 space-y-5">
            {/* Ticket Notches */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-zinc-950 rounded-full border-r border-zinc-800"></div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-zinc-950 rounded-full border-l border-zinc-800"></div>

            {/* Ticket Header Details */}
            <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-mono-num uppercase tracking-widest text-zinc-400 block mb-0.5">
                  Código da Reserva
                </span>
                <span className="font-mono-num text-2xl font-black text-white tracking-wider">
                  #{appointment.id}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono-num uppercase tracking-widest text-zinc-400 block mb-0.5">
                  Status
                </span>
                <span className="inline-block px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800/80 rounded text-[11px] font-bold uppercase tracking-wider">
                  Confirmado
                </span>
              </div>
            </div>

            {/* Grid of details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-zinc-400 block mb-0.5 uppercase tracking-wider text-[10px]">
                  Barbeiro
                </span>
                <span className="font-bold text-white text-sm">
                  {appointment.barberName}
                </span>
              </div>

              <div>
                <span className="text-zinc-400 block mb-0.5 uppercase tracking-wider text-[10px]">
                  Horário
                </span>
                <span className="font-mono-num font-bold text-white text-sm">
                  {appointment.time} ({appointment.totalDurationMin} min)
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-zinc-400 block mb-0.5 uppercase tracking-wider text-[10px]">
                  Data Marcada
                </span>
                <span className="font-semibold text-zinc-100 capitalize">
                  {formatDateExtended(appointment.date)}
                </span>
              </div>

              <div className="col-span-2 pt-2 border-t border-zinc-800/80">
                <span className="text-zinc-400 block mb-1 uppercase tracking-wider text-[10px]">
                  Serviços
                </span>
                <div className="space-y-1">
                  {appointment.serviceNames.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between font-medium text-zinc-200">
                      <span>• {s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-zinc-400 block mb-0.5 uppercase tracking-wider text-[10px]">
                  Cliente
                </span>
                <span className="font-semibold text-white">
                  {appointment.clientName}
                </span>
                <span className="block text-[11px] text-zinc-400 font-mono-num">
                  {appointment.clientPhone}
                </span>
              </div>

              <div className="text-right">
                <span className="text-zinc-400 block mb-0.5 uppercase tracking-wider text-[10px]">
                  Valor a Pagar no Local
                </span>
                {appointment.totalPrice > 0 ? (
                  <span className="font-mono-num font-black text-xl text-white">
                    R$ {appointment.totalPrice.toFixed(2).replace('.', ',')}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-zinc-300 italic">
                    A definir no local
                  </span>
                )}
              </div>

              {appointment.clientNotes && (
                <div className="col-span-2 pt-2 border-t border-zinc-800/80 bg-zinc-900/30 p-2.5 rounded-sm">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-0.5">
                    Observações do Cliente:
                  </span>
                  <p className="text-xs text-zinc-300 italic">
                    "{appointment.clientNotes}"
                  </p>
                </div>
              )}
            </div>

            {/* Stylized Barcode Graphic */}
            <div className="pt-4 border-t border-dashed border-zinc-800 flex flex-col items-center justify-center">
              <div className="h-10 w-full flex items-center justify-center gap-[3px] opacity-80 overflow-hidden">
                {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 6, 1, 3, 5, 2, 4, 1, 3, 5, 2, 4, 1, 6, 3].map((w, i) => (
                  <div
                    key={i}
                    className="bg-zinc-400 h-full"
                    style={{ width: `${w * 2}px` }}
                  />
                ))}
              </div>
              <span className="font-mono-num text-[10px] tracking-widest text-zinc-400 mt-1 uppercase">
                BRO-{appointment.id}-{appointment.date.replace(/-/g, '')}
              </span>
            </div>
          </div>

          {/* Location info */}
          <div className="flex items-center gap-2.5 text-xs text-zinc-400">
            <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>Rua Augusta, 1420 - Consolação, São Paulo - SP</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>

            <button
              onClick={handleDownloadICS}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Adicionar iCal</span>
            </button>

            <button
              onClick={handlePrint}
              className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
          </div>

          {/* Optional Direct WhatsApp confirmation sending */}
          <button
            onClick={handleNotifyBarbershopWhatsApp}
            className="w-full py-2.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/80 text-xs font-bold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Enviar Cópia para o WhatsApp da Barbearia</span>
          </button>

          {/* Finish & New Booking Button */}
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-white text-black hover:bg-zinc-200 font-display font-bold text-sm uppercase tracking-wider rounded-sm transition-all shadow-lg cursor-pointer"
          >
            Concluir & Fazer Novo Agendamento
          </button>
        </div>
      </div>
    </div>
  );
};
