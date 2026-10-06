import React, { useState, useMemo } from 'react';
import { Barber, Appointment, Service } from '../types';
import { BroLogo } from './BroLogo';
import { ComboManager } from './ComboManager';
import { OPERATING_SLOTS, getFormattedDateString, MASTER_PIN } from '../data/barbershopData';
import { 
  Lock, 
  Unlock, 
  KeyRound, 
  User, 
  Calendar, 
  Clock, 
  Scissors, 
  DollarSign, 
  MessageCircle, 
  PhoneCall, 
  CheckCircle2, 
  Trash2, 
  UserPlus, 
  ShieldCheck, 
  ArrowLeft, 
  LogOut, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Filter, 
  Search, 
  Share2, 
  Check, 
  Sparkles,
  Users
} from 'lucide-react';

interface BarberPortalProps {
  barbers: Barber[];
  appointments: Appointment[];
  activeBarber: Barber | null;
  services: Service[];
  onLogin: (barber: Barber) => void;
  onLogout: () => void;
  onBackToClientSite: () => void;
  onRegisterBarber: (newBarber: Barber) => void;
  onUpdateBarberPin: (barberId: string, newPin: string) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onCompleteAppointment: (appointmentId: string) => void;
  onAddManualBlock: (barberId: string, date: string, time: string, reason: string) => void;
  onAddService: (newService: Service) => void;
  onUpdateService: (updatedService: Service) => void;
  onDeleteService: (serviceId: string) => void;
  onResetAllServices: () => void;
}

export const BarberPortal: React.FC<BarberPortalProps> = ({
  barbers,
  appointments,
  activeBarber,
  services,
  onLogin,
  onLogout,
  onBackToClientSite,
  onRegisterBarber,
  onUpdateBarberPin,
  onCancelAppointment,
  onCompleteAppointment,
  onAddManualBlock,
  onAddService,
  onUpdateService,
  onDeleteService,
  onResetAllServices
}) => {
  // Login form states
  const [selectedBarberIdForLogin, setSelectedBarberIdForLogin] = useState<string>(barbers[0]?.id || '');
  const [pinInput, setPinInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>(barbers.length === 0 ? 'register' : 'login');

  // Register new barber states
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Barbeiro Especialista');
  const [newPhone, setNewPhone] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newSpecialties, setNewSpecialties] = useState('Fade, Barba, Tesoura');

  // Portal view states
  const todayStr = useMemo(() => getFormattedDateString(new Date()), []);
  const [portalTab, setPortalTab] = useState<'today' | 'upcoming' | 'block' | 'combos' | 'clients' | 'settings'>('today');
  const [viewAllBarbers, setViewAllBarbers] = useState<boolean>(false); // Only for manager
  const [dateFilter, setDateFilter] = useState<string>(todayStr);
  const [searchClient, setSearchClient] = useState<string>('');
  const [agendaCopied, setAgendaCopied] = useState<boolean>(false);

  // New block form states inside portal
  const [blockTime, setBlockTime] = useState<string>('13:00');
  const [blockDate, setBlockDate] = useState<string>(todayStr);
  const [blockReason, setBlockReason] = useState<string>('Intervalo de Almoço');
  const [blockSaved, setBlockSaved] = useState<boolean>(false);

  // Settings: change PIN
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [pinChangeError, setPinChangeError] = useState<string | null>(null);

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // Check Master PIN 9999
    if (pinInput === MASTER_PIN) {
      const manager = barbers.find((b) => b.isManager) || barbers[0];
      onLogin({ ...manager, name: `${manager.name} (Modo Master)` });
      setPinInput('');
      return;
    }

    const barber = barbers.find((b) => b.id === selectedBarberIdForLogin);
    if (!barber) {
      setLoginError('Barbeiro não encontrado.');
      return;
    }

    if (barber.pin === pinInput.trim()) {
      onLogin(barber);
      setPinInput('');
    } else {
      setLoginError('PIN incorreto. Verifique sua senha de 4 dígitos.');
    }
  };

  // Handle Register submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newPin.trim().length < 4) {
      setLoginError('Preencha o nome e um PIN de pelo menos 4 números.');
      return;
    }

    const initials = newName
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('');

    const newBarber: Barber = {
      id: `barber-${Date.now()}`,
      name: newName.trim(),
      nickname: newName.trim().split(' ')[0],
      role: newRole.trim(),
      experience: 'Recém cadastrado',
      rating: 5.0,
      reviewCount: 1,
      bio: `Especialista em visagismo e atendimento personalizado na BRO Barbearia.`,
      avatarInitials: initials || 'BR',
      specialties: newSpecialties.split(',').map((s) => s.trim()).filter(Boolean),
      pin: newPin.trim(),
      phone: newPhone.trim(),
      isManager: false
    };

    onRegisterBarber(newBarber);
    onLogin(newBarber);
    setNewName('');
    setNewPin('');
    setNewPhone('');
  };

  // Change PIN handler
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError(null);
    setPinChangeSuccess(false);

    if (!activeBarber) return;
    if (currentPinInput !== activeBarber.pin && currentPinInput !== MASTER_PIN) {
      setPinChangeError('PIN atual incorreto.');
      return;
    }

    if (newPinInput.length < 4) {
      setPinChangeError('O novo PIN deve ter pelo menos 4 dígitos.');
      return;
    }

    onUpdateBarberPin(activeBarber.id, newPinInput);
    setPinChangeSuccess(true);
    setCurrentPinInput('');
    setNewPinInput('');
    setTimeout(() => setPinChangeSuccess(false), 3000);
  };

  // WhatsApp helper
  const handleOpenWhatsApp = (app: Appointment) => {
    const cleanPhone = app.clientPhone.replace(/\D/g, '');
    const phoneParam = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const msg = `Olá, ${app.clientName}! 💈 Aqui é o ${activeBarber?.name || 'seu barbeiro'} da BRO Barbearia.\n\nSeu agendamento #${app.id} está confirmado para o dia ${app.date} às ${app.time}.\nServiços: ${app.serviceNames.join(' + ')}\n\nEstou te esperando!`;
    const url = `https://api.whatsapp.com/send?phone=${phoneParam}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Copy schedule helper
  const handleCopySchedule = () => {
    const list = appointments
      .filter((a) => {
        if (!viewAllBarbers && a.barberId !== activeBarber?.id) return false;
        if (a.date !== dateFilter) return false;
        if (a.status === 'cancelled') return false;
        return true;
      })
      .sort((a, b) => a.time.localeCompare(b.time));

    if (list.length === 0) {
      navigator.clipboard.writeText(`💈 BRO Barbearia - Agenda de ${activeBarber?.name} para ${dateFilter}: Nenhuma reserva.`);
      setAgendaCopied(true);
      setTimeout(() => setAgendaCopied(false), 2000);
      return;
    }

    const lines = list.map((a) => {
      if (a.isManualBlock) return `⏰ ${a.time} - [PAUSA] ${a.blockReason || 'Bloqueio'}`;
      return `⏰ ${a.time} - ${a.clientName} (${a.serviceNames.join(', ')}) · R$ ${a.totalPrice.toFixed(2).replace('.', ',')}`;
    });

    const text = `💈 BRO BARBEARIA - AGENDA PRIVADA\nProfissional: ${viewAllBarbers ? 'Toda a Equipe' : activeBarber?.name}\nData: ${dateFilter}\nTotal de Clientes: ${list.filter(a => !a.isManualBlock).length}\n\n${lines.join('\n')}`;
    navigator.clipboard.writeText(text);
    setAgendaCopied(true);
    setTimeout(() => setAgendaCopied(false), 2000);
  };

  // Save manual block
  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBarber) return;
    onAddManualBlock(activeBarber.id, blockDate, blockTime, blockReason);
    setBlockSaved(true);
    setTimeout(() => setBlockSaved(false), 2500);
  };

  // Filtered appointments for active barber (PRIVACY ENFORCED!)
  const myAppointments = useMemo(() => {
    return appointments.filter((app) => {
      // If manager chose "viewAllBarbers", show all; otherwise strictly ONLY this barber's appointments!
      if (!viewAllBarbers && app.barberId !== activeBarber?.id) return false;

      // Filter by tab date
      if (portalTab === 'today' && app.date !== todayStr) return false;
      if (portalTab === 'upcoming' && app.date !== dateFilter) return false;

      if (searchClient.trim()) {
        const query = searchClient.toLowerCase();
        const matchesClient = app.clientName.toLowerCase().includes(query);
        const matchesPhone = app.clientPhone.toLowerCase().includes(query);
        const matchesCode = app.id.toLowerCase().includes(query);
        if (!matchesClient && !matchesPhone && !matchesCode) return false;
      }

      return true;
    }).sort((a, b) => {
      const dateCmp = a.date.localeCompare(b.date);
      if (dateCmp !== 0) return dateCmp;
      return a.time.localeCompare(b.time);
    });
  }, [appointments, activeBarber, viewAllBarbers, portalTab, todayStr, dateFilter, searchClient]);

  // Unique clients list who cut with this barber
  const myClientsList = useMemo(() => {
    const clientsMap = new Map<string, { name: string; phone: string; count: number; lastDate: string; totalSpent: number }>();

    appointments
      .filter((a) => (viewAllBarbers ? true : a.barberId === activeBarber?.id) && !a.isManualBlock && a.status !== 'cancelled')
      .forEach((a) => {
        const key = a.clientPhone || a.clientName;
        if (!clientsMap.has(key)) {
          clientsMap.set(key, {
            name: a.clientName,
            phone: a.clientPhone,
            count: 1,
            lastDate: a.date,
            totalSpent: a.totalPrice
          });
        } else {
          const item = clientsMap.get(key)!;
          item.count += 1;
          item.totalSpent += a.totalPrice;
          if (a.date > item.lastDate) item.lastDate = a.date;
        }
      });

    return Array.from(clientsMap.values()).sort((a, b) => b.count - a.count);
  }, [appointments, activeBarber, viewAllBarbers]);

  // Barber Today's metrics
  const todayApps = useMemo(() => {
    return appointments.filter((a) => a.barberId === activeBarber?.id && a.date === todayStr && a.status !== 'cancelled' && !a.isManualBlock);
  }, [appointments, activeBarber, todayStr]);

  const todayRevenue = useMemo(() => {
    return todayApps.reduce((acc, a) => acc + a.totalPrice, 0);
  }, [todayApps]);

  const todayCompleted = useMemo(() => {
    return todayApps.filter((a) => a.status === 'completed').length;
  }, [todayApps]);

  // ==========================================
  // VIEW 1: LOGIN / REGISTRATION SCREEN
  // ==========================================
  if (!activeBarber) {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between p-4 sm:p-6 selection:bg-white selection:text-black">
        {/* Top Header with Back button */}
        <header className="max-w-xl w-full mx-auto flex items-center justify-between py-4">
          <button
            onClick={onBackToClientSite}
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Site de Agendamento</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-mono-num text-zinc-400 uppercase tracking-widest">Acesso Restrito</span>
          </div>
        </header>

        {/* Center Auth Card */}
        <div className="max-w-md w-full mx-auto my-auto bg-zinc-950/90 border border-zinc-800 rounded-sm p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col items-center text-center mb-6">
            <BroLogo size="md" showSubtitle={true} className="mb-4" />
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-xs text-[10px] font-mono-num font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3 text-zinc-400" />
              Portal Exclusivo do Barbeiro
            </div>
            <h1 className="font-display font-bold text-xl text-white">
              Área Privada do Profissional
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
              Acesse com seu PIN individual para consultar seus agendamentos, clientes e horários em total privacidade.
            </p>
          </div>

          {/* Tab Selector: Entrar vs Cadastrar */}
          <div className="flex items-center bg-zinc-900 p-1 rounded-sm border border-zinc-800 mb-6">
            <button
              onClick={() => { setAuthTab('login'); setLoginError(null); }}
              className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                authTab === 'login'
                  ? 'bg-white text-black shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Entrar na Minha Área
            </button>
            <button
              onClick={() => { setAuthTab('register'); setLoginError(null); }}
              className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                authTab === 'register'
                  ? 'bg-white text-black shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Cadastrar Barbeiro
            </button>
          </div>

          {/* Form: LOGIN */}
          {authTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {barbers.length === 0 ? (
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm text-xs text-zinc-300 text-center space-y-2">
                  <p>Nenhum barbeiro cadastrado no momento.</p>
                  <button
                    type="button"
                    onClick={() => setAuthTab('register')}
                    className="px-3 py-1.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer"
                  >
                    Cadastrar Primeiro Barbeiro
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Selecione seu Nome
                    </label>
                    <div className="relative">
                      <select
                        value={selectedBarberIdForLogin}
                        onChange={(e) => setSelectedBarberIdForLogin(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 py-3 px-3.5 rounded-sm text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors cursor-pointer"
                      >
                        {barbers.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                        PIN Pessoal (Senha de 4 dígitos)
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {showPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showPin ? 'Ocultar' : 'Mostrar'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type={showPin ? 'text' : 'password'}
                        maxLength={8}
                        required
                        placeholder="Digite seu PIN"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-sm text-sm text-white placeholder-zinc-500 font-mono-num tracking-widest focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-3 bg-red-950/70 border border-red-900 rounded-sm text-xs text-red-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-white text-black hover:bg-zinc-200 font-display font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Acessar Minha Agenda Privada</span>
                  </button>
                </>
              )}
            </form>
          ) : (
            /* Form: CADASTRO DE NOVO BARBEIRO */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                  Nome Completo do Barbeiro *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rafael Castro"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 py-2.5 px-3 rounded-sm text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                  Cargo / Especialidade Principal
                </label>
                <input
                  type="text"
                  placeholder="Ex: Barbeiro & Especialista em Barba"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 py-2.5 px-3 rounded-sm text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="(11) 98888-7777"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 py-2.5 px-3 rounded-sm text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                    Crie um PIN (4 dígitos) *
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="Ex: 5050"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 py-2.5 px-3 rounded-sm text-xs text-white font-mono-num focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                  Especialidades (separadas por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Fade Navalhado, Barboterapia, Visagismo"
                  value={newSpecialties}
                  onChange={(e) => setNewSpecialties(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 py-2.5 px-3 rounded-sm text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              {loginError && (
                <div className="p-2.5 bg-red-950/70 border border-red-900 rounded-sm text-xs text-red-200">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-white text-black hover:bg-zinc-200 font-display font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Concluir Cadastro & Entrar</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <footer className="py-4 text-center text-[11px] text-zinc-600">
          BRO Barbearia · Área Segura para Profissionais · Dados Criptografados Localmente
        </footer>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED BARBER PORTAL
  // ==========================================
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-white selection:text-black">
      
      {/* Top Professional Bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Barber Profile */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-white text-black font-display font-black text-xs flex items-center justify-center shadow-md">
              {activeBarber.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-white">
                  {activeBarber.name}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono-num font-semibold px-2 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Sessão Privada
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 block -mt-0.5">
                {activeBarber.role}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToClientSite}
              className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
              title="Abrir o site público de agendamento"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Site do Cliente</span>
              <span className="sm:hidden">Site</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/60 rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
              title="Sair e bloquear acesso"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bloquear / Sair</span>
              <span className="sm:hidden">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Personal Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-zinc-950 border border-zinc-800/90 rounded-sm">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
              Meus Clientes Hoje
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono-num text-2xl font-black text-white">
                {todayApps.length}
              </span>
              <span className="text-xs text-zinc-500 font-mono-num">
                ({todayCompleted} atendidos)
              </span>
            </div>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800/90 rounded-sm">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
              Meu Faturamento Hoje
            </span>
            <span className="font-mono-num text-2xl font-black text-emerald-400">
              R$ {todayRevenue.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800/90 rounded-sm">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
              Total de Clientes Atendidos
            </span>
            <span className="font-mono-num text-2xl font-black text-zinc-200">
              {myClientsList.length}
            </span>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800/90 rounded-sm flex flex-col justify-between">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
              Compartilhar Agenda
            </span>
            <button
              onClick={handleCopySchedule}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold uppercase tracking-wider border border-zinc-700 rounded-sm transition-colors cursor-pointer"
            >
              {agendaCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{agendaCopied ? 'Copiado!' : 'Copiar p/ WhatsApp'}</span>
            </button>
          </div>
        </div>

        {/* Manager Mode Toggle if manager */}
        {activeBarber.isManager && (
          <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-zinc-300">
                Você é <strong>Gerente da BRO Barbearia</strong>. Deseja alternar a visualização?
              </span>
            </div>
            <button
              onClick={() => setViewAllBarbers(!viewAllBarbers)}
              className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                viewAllBarbers
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-zinc-800 text-zinc-300 hover:text-white'
              }`}
            >
              {viewAllBarbers ? 'Mostrando Todos os Barbeiros' : 'Mostrando Apenas Meus Clientes'}
            </button>
          </div>
        )}

        {/* Navigation Tabs of Barber Portal */}
        <div className="border-b border-zinc-800 flex items-center gap-2 overflow-x-auto scrollbar-none pb-px">
          <button
            onClick={() => setPortalTab('today')}
            className={`py-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer shrink-0 ${
              portalTab === 'today'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Agenda de Hoje ({todayStr.split('-')[2]}/{todayStr.split('-')[1]})
          </button>

          <button
            onClick={() => setPortalTab('upcoming')}
            className={`py-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer shrink-0 ${
              portalTab === 'upcoming'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Próximos Dias & Outras Datas
          </button>

          <button
            onClick={() => setPortalTab('block')}
            className={`py-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer shrink-0 ${
              portalTab === 'block'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Bloquear Meu Horário (Almoço/Pausa)
          </button>

          <button
            onClick={() => setPortalTab('clients')}
            className={`py-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer shrink-0 ${
              portalTab === 'clients'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Meus Clientes ({myClientsList.length})
          </button>

          <button
            onClick={() => setPortalTab('combos')}
            className={`py-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              portalTab === 'combos'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Combos & Serviços ({services.length})</span>
          </button>

          <button
            onClick={() => setPortalTab('settings')}
            className={`py-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer shrink-0 ${
              portalTab === 'settings'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Meu PIN & Segurança
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1 & 2: AGENDA DE HOJE / PRÓXIMOS DIAS */}
        {/* ========================================================= */}
        {(portalTab === 'today' || portalTab === 'upcoming') && (
          <div className="space-y-4">
            
            {/* Filter and Date picker bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950 p-3.5 border border-zinc-800 rounded-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Data:
                </span>
                <input
                  type="date"
                  value={portalTab === 'today' ? todayStr : dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  disabled={portalTab === 'today'}
                  className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded text-xs text-white focus:outline-none focus:border-white disabled:opacity-60"
                />
              </div>

              {/* Search client input */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filtrar por cliente, telefone ou código..."
                  value={searchClient}
                  onChange={(e) => setSearchClient(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                />
              </div>
            </div>

            {/* List of Appointments */}
            <div className="border border-zinc-800 rounded-sm overflow-hidden bg-zinc-950">
              {myAppointments.length === 0 ? (
                <div className="p-12 text-center text-zinc-400 space-y-2">
                  <Calendar className="w-8 h-8 mx-auto text-zinc-600" />
                  <p className="text-sm font-semibold text-zinc-300">
                    Nenhum cliente agendado para esta data.
                  </p>
                  <p className="text-xs text-zinc-500">
                    Seus horários continuam livres para reservas na página pública da barbearia.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/80">
                  {myAppointments.map((app) => {
                    const isBlocked = app.isManualBlock;
                    const isCompleted = app.status === 'completed';
                    const isCancelled = app.status === 'cancelled';

                    return (
                      <div
                        key={app.id}
                        className={`p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          isCancelled
                            ? 'bg-zinc-950/40 opacity-40'
                            : isBlocked
                            ? 'bg-zinc-900/30 border-l-2 border-l-amber-500'
                            : isCompleted
                            ? 'bg-zinc-900/20 border-l-2 border-l-zinc-600'
                            : 'bg-zinc-950 hover:bg-zinc-900/40 border-l-2 border-l-emerald-500'
                        }`}
                      >
                        {/* Left: Time and Client details */}
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono-num text-xs font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">
                              ⏰ {app.time}
                            </span>

                            <span className="font-mono-num text-[11px] text-zinc-400">
                              #{app.id}
                            </span>

                            <h4 className="font-display font-bold text-sm text-white">
                              {app.clientName}
                            </h4>

                            {isBlocked ? (
                              <span className="px-2 py-0.2 text-[10px] font-bold uppercase tracking-wider bg-amber-950 text-amber-400 border border-amber-800 rounded">
                                Bloqueio Pessoal ({app.blockReason || 'Pausa'})
                              </span>
                            ) : (
                              <span className={`px-2 py-0.2 text-[10px] font-bold uppercase tracking-wider rounded border ${
                                isCompleted
                                  ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                                  : isCancelled
                                  ? 'bg-red-950 text-red-400 border-red-900'
                                  : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              }`}>
                                {app.status === 'confirmed' ? 'Confirmado' : app.status === 'completed' ? 'Atendido' : 'Cancelado'}
                              </span>
                            )}

                            {viewAllBarbers && (
                              <span className="text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                                Barbeiro: {app.barberName}
                              </span>
                            )}
                          </div>

                          {/* Contact and Pricing info */}
                          {!isBlocked && (
                            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                              <span className="font-mono-num text-zinc-300">
                                📞 {app.clientPhone}
                              </span>

                              <span className="font-mono-num font-bold text-emerald-400">
                                💵 R$ {app.totalPrice.toFixed(2).replace('.', ',')}
                              </span>

                              <span className="text-zinc-500">
                                ⏱️ {app.totalDurationMin} min
                              </span>

                              <span className="text-zinc-300 font-medium">
                                ✂️ {app.serviceNames.join(' + ')}
                              </span>
                            </div>
                          )}

                          {/* Client Notes / Preferences */}
                          {app.clientNotes && (
                            <div className="text-xs bg-zinc-900/50 p-2 rounded-xs border border-zinc-800/80 text-zinc-300">
                              <span className="text-[10px] uppercase font-bold text-zinc-400 mr-1.5">
                                Observações do Cliente:
                              </span>
                              <em>"{app.clientNotes}"</em>
                            </div>
                          )}
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          {/* Direct WhatsApp Call */}
                          {!isBlocked && app.status !== 'cancelled' && (
                            <button
                              onClick={() => handleOpenWhatsApp(app)}
                              className="px-2.5 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Conversar com o cliente no WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>WhatsApp</span>
                            </button>
                          )}

                          {/* Mark Complete */}
                          {app.status === 'confirmed' && !isBlocked && (
                            <button
                              onClick={() => onCompleteAppointment(app.id)}
                              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                              title="Marcar como atendimento finalizado"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Concluir</span>
                            </button>
                          )}

                          {/* Cancel / Free Slot */}
                          {app.status !== 'cancelled' && (
                            <button
                              onClick={() => onCancelAppointment(app.id)}
                              className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/80 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                              title={isBlocked ? "Liberar horário bloqueado" : "Cancelar reserva e liberar horário para outros clientes"}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              <span>{isBlocked ? 'Desbloquear' : 'Cancelar'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: BLOQUEAR HORÁRIO PESSOAL (ALMOÇO/PAUSA) */}
        {/* ========================================================= */}
        {portalTab === 'block' && (
          <div className="max-w-xl mx-auto bg-zinc-950 border border-zinc-800 p-6 rounded-sm space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Bloqueio Pessoal de Horário
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Bloqueie um horário específico na sua agenda para almoço, descanso ou compromisso particular. Ele ficará indisponível para clientes.
              </p>
            </div>

            <form onSubmit={handleSaveBlock} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                    Data do Bloqueio
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                    Horário da Vaga
                  </label>
                  <select
                    value={blockTime}
                    onChange={(e) => setBlockTime(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-white"
                  >
                    {OPERATING_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                  Motivo da Indisponibilidade
                </label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Ex: Almoço, Intervalo de descanso, Médico"
                  className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              {blockSaved && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Horário bloqueado com sucesso na sua agenda! Clientes não poderão selecionar este horário.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-white text-black hover:bg-zinc-200 font-display font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Salvar Bloqueio na Minha Agenda</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: MEUS CLIENTES (PRIVACIDADE DE CADA CLIENTE) */}
        {/* ========================================================= */}
        {portalTab === 'clients' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-zinc-300" />
                  Carteira Privada de Clientes ({myClientsList.length})
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Lista de clientes que agendam com você. Apenas você tem acesso a essa lista.
                </p>
              </div>
            </div>

            <div className="border border-zinc-800 rounded-sm overflow-hidden bg-zinc-950">
              {myClientsList.length === 0 ? (
                <div className="p-10 text-center text-zinc-400 text-xs">
                  Você ainda não possui clientes registrados nesta sessão.
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/80">
                  {myClientsList.map((client, idx) => (
                    <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/30">
                      <div>
                        <h4 className="font-bold text-sm text-white">
                          {client.name}
                        </h4>
                        <span className="font-mono-num text-xs text-zinc-400">
                          {client.phone}
                        </span>
                        <div className="flex items-center gap-3 text-[11px] text-zinc-500 mt-1">
                          <span>{client.count} {client.count === 1 ? 'atendimento' : 'atendimentos'}</span>
                          <span>·</span>
                          <span>Último corte: {client.lastDate}</span>
                          <span>·</span>
                          <span className="font-mono-num text-emerald-400 font-semibold">Total: R$ {client.totalSpent.toFixed(2).replace('.', ',')}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const clean = client.phone.replace(/\D/g, '');
                          const p = clean.startsWith('55') ? clean : `55${clean}`;
                          window.open(`https://api.whatsapp.com/send?phone=${p}&text=${encodeURIComponent(`Olá ${client.name}! Aqui é o ${activeBarber.name} da BRO Barbearia. Tudo bem?`)}`, '_blank');
                        }}
                        className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Conversar no WhatsApp</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: MEU PIN & SEGURANÇA */}
        {/* ========================================================= */}
        {portalTab === 'settings' && (
          <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 p-6 rounded-sm space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-zinc-300" />
                Alterar Meu PIN de Acesso
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Troque sua senha pessoal para garantir que apenas você acesse seus agendamentos e clientes.
              </p>
            </div>

            <form onSubmit={handleChangePin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                  PIN Atual
                </label>
                <input
                  type="password"
                  required
                  placeholder="Digite o PIN atual"
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 py-2.5 px-3 rounded-sm text-sm text-white font-mono-num tracking-widest focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                  Novo PIN (4 dígitos)
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  placeholder="Digite o novo PIN"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 py-2.5 px-3 rounded-sm text-sm text-white font-mono-num tracking-widest focus:outline-none focus:border-white"
                />
              </div>

              {pinChangeError && (
                <div className="p-2.5 bg-red-950/70 border border-red-900 rounded text-xs text-red-200">
                  {pinChangeError}
                </div>
              )}

              {pinChangeSuccess && (
                <div className="p-2.5 bg-emerald-950/80 border border-emerald-800 rounded text-xs text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>PIN atualizado com sucesso! Use este novo código no próximo login.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-white text-black hover:bg-zinc-200 font-display font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md cursor-pointer"
              >
                Salvar Novo PIN
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: GESTÃO DE COMBOS & SERVIÇOS */}
        {/* ========================================================= */}
        {portalTab === 'combos' && (
          <div className="bg-zinc-950 border border-zinc-800 p-5 sm:p-7 rounded-sm">
            <ComboManager
              services={services}
              onAddService={onAddService}
              onUpdateService={onUpdateService}
              onDeleteService={onDeleteService}
              onResetAllServices={onResetAllServices}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-zinc-900 text-center text-[11px] text-zinc-500">
        BRO Barbearia · Área Privada de {activeBarber.name} · Sessão Individual Protegida
      </footer>
    </div>
  );
};
