import React, { useState, useMemo } from 'react';
import { Appointment, Barber, Service } from '../types';
import { OPERATING_SLOTS, getFormattedDateString } from '../data/barbershopData';
import { ComboManager } from './ComboManager';
import { 
  X, 
  Trash2, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Search, 
  Filter, 
  RefreshCw, 
  Scissors, 
  Calendar, 
  Clock, 
  User, 
  DollarSign, 
  AlertCircle,
  PlusCircle,
  FileText,
  MessageCircle,
  PhoneCall,
  Share2,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { BroLogo } from './BroLogo';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  barbers: Barber[];
  services?: Service[];
  onCancelAppointment: (appointmentId: string) => void;
  onCompleteAppointment: (appointmentId: string) => void;
  onAddManualBlock: (barberId: string, date: string, time: string, reason: string) => void;
  onResetDemoData: () => void;
  onClearAllData: () => void;
  onAddService?: (newService: Service) => void;
  onUpdateService?: (updatedService: Service) => void;
  onDeleteService?: (serviceId: string) => void;
  onResetAllServices?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  appointments,
  barbers,
  services = [],
  onCancelAppointment,
  onCompleteAppointment,
  onAddManualBlock,
  onResetDemoData,
  onClearAllData,
  onAddService,
  onUpdateService,
  onDeleteService,
  onResetAllServices
}) => {
  const [adminTab, setAdminTab] = useState<'appointments' | 'combos'>('appointments');
  const [filterBarber, setFilterBarber] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showBlockForm, setShowBlockForm] = useState(false);

  // Manual block form states
  const todayStr = useMemo(() => getFormattedDateString(new Date()), []);
  const [blockBarberId, setBlockBarberId] = useState<string>(barbers[0]?.id || '');
  const [blockDate, setBlockDate] = useState<string>(todayStr);
  const [blockTime, setBlockTime] = useState<string>(OPERATING_SLOTS[0] || '12:00');
  const [blockReason, setBlockReason] = useState<string>('Intervalo de Almoço');

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      if (filterBarber !== 'all' && app.barberId !== filterBarber) return false;
      if (filterStatus !== 'all' && app.status !== filterStatus) return false;
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesClient = app.clientName.toLowerCase().includes(query);
        const matchesPhone = app.clientPhone.toLowerCase().includes(query);
        const matchesCode = app.id.toLowerCase().includes(query);
        const matchesServices = app.serviceNames.some(s => s.toLowerCase().includes(query));
        if (!matchesClient && !matchesPhone && !matchesCode && !matchesServices) return false;
      }
      return true;
    }).sort((a, b) => {
      // Sort by date and time
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  }, [appointments, filterBarber, filterStatus, searchTerm]);

  // Statistics
  const activeCount = appointments.filter((a) => a.status === 'confirmed' && !a.isManualBlock).length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const totalRevenue = appointments
    .filter((a) => a.status !== 'cancelled' && !a.isManualBlock)
    .reduce((sum, a) => sum + a.totalPrice, 0);

  const [agendaCopied, setAgendaCopied] = useState(false);

  // Send WhatsApp message directly to client
  const handleOpenWhatsApp = (app: Appointment) => {
    const cleanPhone = app.clientPhone.replace(/\D/g, '');
    const phoneParam = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const msg = `Olá, ${app.clientName}! 💈 Aqui é da BRO Barbearia.\n\nSeu agendamento #${app.id} está confirmado com ${app.barberName}!\n📅 Data: ${app.date}\n⏰ Horário: ${app.time}\n✂️ Serviços: ${app.serviceNames.join(' + ')}\n💰 Valor: R$ ${app.totalPrice.toFixed(2).replace('.', ',')}\n📍 Local: Rua Augusta, 1420 - Consolação, São Paulo\n\nTe esperamos na barbearia!`;
    const url = `https://api.whatsapp.com/send?phone=${phoneParam}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Copy full daily schedule to clipboard
  const handleCopyDaySchedule = () => {
    const targetDate = filterBarber !== 'all' ? todayStr : todayStr;
    const dayApps = appointments
      .filter((a) => a.date === targetDate && a.status !== 'cancelled')
      .sort((a, b) => a.time.localeCompare(b.time));

    if (dayApps.length === 0) {
      navigator.clipboard.writeText(`💈 BRO BARBEARIA - AGENDA (${targetDate})\nNenhum agendamento para este dia.`);
      setAgendaCopied(true);
      setTimeout(() => setAgendaCopied(false), 2500);
      return;
    }

    const lines = dayApps.map((a) => {
      if (a.isManualBlock) {
        return `⏰ ${a.time} - [BLOQUEIO] ${a.blockReason || 'Pausa'} (${a.barberName})`;
      }
      return `⏰ ${a.time} - ${a.clientName} (${a.serviceNames.join(', ')}) com ${a.barberName} · R$ ${a.totalPrice.toFixed(2).replace('.', ',')}`;
    });

    const fullText = `💈 AGENDA BRO BARBEARIA - ${targetDate}\nTotal de Agendamentos: ${dayApps.filter(a => !a.isManualBlock).length}\n\n${lines.join('\n')}\n\n*Gerado pelo Sistema BRO Barbearia*`;
    navigator.clipboard.writeText(fullText);
    setAgendaCopied(true);
    setTimeout(() => setAgendaCopied(false), 2500);
  };

  if (!isOpen) return null;

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockBarberId || !blockDate || !blockTime) return;
    onAddManualBlock(blockBarberId, blockDate, blockTime, blockReason);
    setShowBlockForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-sm shadow-2xl text-zinc-100 my-4 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-black border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <BroLogo size="sm" showSubtitle={false} />
            <div className="border-l border-zinc-800 pl-3">
              <h2 className="font-display font-bold text-sm tracking-tight text-white flex items-center gap-2">
                PAINEL DA BARBEARIA
                <span className="text-[10px] font-mono-num font-normal px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                  Gestão Interna
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400">
                Gerencie todos os horários marcados, libere vagas ou bloqueie pausas na agenda.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-sm transition-colors cursor-pointer"
            title="Fechar painel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs between Appointments and Combos */}
        <div className="flex items-center gap-2 px-6 pt-2 border-b border-zinc-800 bg-black shrink-0">
          <button
            onClick={() => setAdminTab('appointments')}
            className={`py-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              adminTab === 'appointments'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Agendamentos ({appointments.length})
          </button>

          <button
            onClick={() => setAdminTab('combos')}
            className={`py-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              adminTab === 'combos'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Criar / Gerenciar Combos ({services.length})</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="p-6 overflow-y-auto space-y-6">
          {adminTab === 'combos' ? (
            <ComboManager
              services={services}
              onAddService={onAddService || (() => {})}
              onUpdateService={onUpdateService || (() => {})}
              onDeleteService={onDeleteService || (() => {})}
              onResetAllServices={onResetAllServices || (() => {})}
            />
          ) : (
            <>
          {/* Metrics Overview Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-sm">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
                Agendamentos Ativos
              </span>
              <span className="font-mono-num text-2xl font-black text-white">
                {activeCount}
              </span>
            </div>

            <div className="p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-sm">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
                Faturamento Estimado
              </span>
              <span className="font-mono-num text-2xl font-black text-emerald-400">
                R$ {totalRevenue.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <div className="p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-sm">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
                Atendimentos Concluídos
              </span>
              <span className="font-mono-num text-2xl font-black text-zinc-300">
                {completedCount}
              </span>
            </div>

            <div className="p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-sm flex flex-col justify-between gap-2">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 block">
                Ações Rápidas
              </span>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={handleCopyDaySchedule}
                  className="flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-200 bg-zinc-800 hover:bg-zinc-700 hover:text-white px-2.5 py-1.5 rounded transition-colors cursor-pointer"
                  title="Copia a lista de clientes e horários de hoje para colar no WhatsApp"
                >
                  {agendaCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{agendaCopied ? 'Agenda Copiada!' : 'Copiar Agenda p/ WhatsApp'}</span>
                </button>
                <button
                  onClick={() => setShowBlockForm(!showBlockForm)}
                  className="flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-2.5 py-1.5 rounded transition-colors cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>{showBlockForm ? 'Fechar Bloqueio' : 'Bloquear Horário'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Explanatory Info Card: Where bookings go and how to manage */}
          <div className="p-3.5 bg-zinc-900/40 border border-zinc-800 rounded-sm flex items-start gap-3 text-xs text-zinc-400">
            <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-zinc-200 block">
                Central de Agendamentos & Confirmações:
              </span>
              <p className="leading-relaxed">
                Todas as reservas feitas pelos clientes no site <strong>caem instantaneamente nesta lista</strong> em tempo real. Você pode clicar em <strong className="text-emerald-400">"WhatsApp"</strong> para abrir a conversa com o cliente com a confirmação preenchida, ou clicar em <strong className="text-zinc-200">"Copiar Agenda"</strong> para enviar o resumo do dia no grupo de WhatsApp dos barbeiros.
              </p>
            </div>
          </div>

          {/* Form to Manually Block a Time Slot (Pausa, Almoço, etc) */}
          {showBlockForm && (
            <form onSubmit={handleCreateBlock} className="p-4 bg-zinc-900 border border-zinc-700 rounded-sm space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Bloquear Vaga na Agenda (Pausa Técnica / Almoço)
                </span>
                <span className="text-[11px] text-zinc-400">
                  Isso tornará o horário indisponível para novos agendamentos de clientes.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                    Barbeiro
                  </label>
                  <select
                    value={blockBarberId}
                    onChange={(e) => setBlockBarberId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded text-zinc-200 text-xs focus:outline-none focus:border-white"
                  >
                    {barbers.length === 0 && (
                      <option value="">Nenhum barbeiro cadastrado</option>
                    )}
                    {barbers.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded text-zinc-200 text-xs focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                    Horário
                  </label>
                  <select
                    value={blockTime}
                    onChange={(e) => setBlockTime(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded text-zinc-200 text-xs focus:outline-none focus:border-white"
                  >
                    {OPERATING_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                    Motivo do Bloqueio
                  </label>
                  <input
                    type="text"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="Ex: Almoço, Reunião, Manutenção"
                    className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded text-zinc-200 text-xs focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBlockForm(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider rounded"
                >
                  Salvar Bloqueio
                </button>
              </div>
            </form>
          )}

          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por cliente, telefone, código #BRO ou serviço..."
                className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-white"
              />
            </div>

            {/* Barber Filter */}
            <select
              value={filterBarber}
              onChange={(e) => setFilterBarber(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-sm px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-white"
            >
              <option value="all">Todos os Barbeiros</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-sm px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-white"
            >
              <option value="all">Todos os Status</option>
              <option value="confirmed">Confirmados</option>
              <option value="completed">Concluídos</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>

          {/* Appointments Table / Cards */}
          <div className="border border-zinc-800 rounded-sm overflow-hidden">
            {filteredAppointments.length === 0 ? (
              <div className="p-12 text-center text-zinc-400 space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-zinc-600" />
                <p className="text-sm font-semibold text-zinc-300">
                  Nenhum agendamento encontrado
                </p>
                <p className="text-xs text-zinc-400">
                  Ajuste os filtros de busca ou crie um novo agendamento na página principal.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/80">
                {filteredAppointments.map((app) => {
                  const isBlocked = app.isManualBlock;
                  const isCancelled = app.status === 'cancelled';
                  const isCompleted = app.status === 'completed';

                  return (
                    <div
                      key={app.id}
                      className={`p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isCancelled
                          ? 'bg-zinc-950/40 opacity-50'
                          : isBlocked
                          ? 'bg-zinc-950/80 border-l-2 border-l-amber-500'
                          : isCompleted
                          ? 'bg-zinc-900/30 border-l-2 border-l-zinc-600'
                          : 'bg-zinc-950 hover:bg-zinc-900/50 border-l-2 border-l-emerald-500'
                      }`}
                    >
                      {/* Left: Client & Service details */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono-num text-xs font-bold text-white bg-zinc-800 px-1.5 py-0.5 rounded">
                            #{app.id}
                          </span>
                          
                          <h4 className="font-display font-bold text-sm text-white">
                            {app.clientName}
                          </h4>

                          {isBlocked ? (
                            <span className="px-2 py-0.2 text-[10px] font-bold uppercase tracking-wider bg-amber-950 text-amber-400 border border-amber-800 rounded">
                              Bloqueio Manual ({app.blockReason || 'Pausa'})
                            </span>
                          ) : (
                            <span className={`px-2 py-0.2 text-[10px] font-bold uppercase tracking-wider rounded border ${
                              isCompleted
                                ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                                : isCancelled
                                ? 'bg-red-950 text-red-400 border-red-900'
                                : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            }`}>
                              {app.status === 'confirmed' ? 'Confirmado' : app.status === 'completed' ? 'Concluído' : 'Cancelado'}
                            </span>
                          )}

                          {!isBlocked && (
                            <span className="font-mono-num text-xs text-zinc-400">
                              {app.clientPhone}
                            </span>
                          )}
                        </div>

                        {/* Schedule & Barber Info */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                          <div className="flex items-center gap-1 text-zinc-300">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="font-mono-num font-semibold">{app.date} às {app.time}</span>
                            <span className="text-zinc-600">({app.totalDurationMin} min)</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Scissors className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{app.barberName}</span>
                          </div>

                          {!isBlocked && (
                            <div className="flex items-center gap-1 font-mono-num font-bold text-zinc-200">
                              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                              <span>R$ {app.totalPrice.toFixed(2).replace('.', ',')}</span>
                            </div>
                          )}
                        </div>

                        {/* Services & Notes */}
                        {!isBlocked && (
                          <div className="text-xs text-zinc-400">
                            <span className="text-zinc-400 font-medium">{app.serviceNames.join(' + ')}</span>
                            {app.clientNotes && (
                              <p className="text-[11px] text-zinc-400 italic mt-0.5">
                                Obs: "{app.clientNotes}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: Management Actions */}
                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        {/* Direct WhatsApp notification button */}
                        {!isBlocked && app.status !== 'cancelled' && (
                          <button
                            onClick={() => handleOpenWhatsApp(app)}
                            className="px-2.5 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Enviar confirmação e chamar no WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </button>
                        )}

                        {app.status === 'confirmed' && !isBlocked && (
                          <button
                            onClick={() => onCompleteAppointment(app.id)}
                            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                            title="Marcar como atendimento realizado"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Concluir</span>
                          </button>
                        )}

                        {app.status !== 'cancelled' && (
                          <button
                            onClick={() => onCancelAppointment(app.id)}
                            className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/80 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                            title={isBlocked ? "Desbloquear horário na agenda" : "Cancelar agendamento e liberar horário de volta para clientes"}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            <span>{isBlocked ? 'Desbloquear Vaga' : 'Cancelar Reserva'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Controls & Reset Helpers */}
          <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Armazenamento local (localStorage) ativo e sincronizado.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onResetDemoData}
                className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Recarrega agendamentos de exemplo"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurar Dados de Exemplo</span>
              </button>

              <span className="text-zinc-700">|</span>

              <button
                onClick={onClearAllData}
                className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                title="Limpar todos os agendamentos"
              >
                Limpar Todos os Dados
              </button>
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
};
