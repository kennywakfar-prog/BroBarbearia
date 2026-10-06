import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BARBERS, 
  SERVICES, 
  OPERATING_SLOTS, 
  STORAGE_KEY_APPOINTMENTS, 
  STORAGE_KEY_BARBERS,
  STORAGE_KEY_SERVICES,
  STORAGE_KEY_SESSION_BARBER,
  generateSeedAppointments, 
  getFormattedDateString 
} from './data/barbershopData';
import { Barber, Service, Appointment } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { BarberSelector } from './components/BarberSelector';
import { ServiceSelector } from './components/ServiceSelector';
import { ScheduleGrid } from './components/ScheduleGrid';
import { ClientForm } from './components/ClientForm';
import { TicketModal } from './components/TicketModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { BarberPortal } from './components/BarberPortal';
import { Footer } from './components/Footer';
import { AnimatedBackground } from './components/AnimatedBackground';
import { StepIndicator } from './components/StepIndicator';
import { MobileBottomBar } from './components/MobileBottomBar';

export default function App() {
  // Clean legacy mock keys if present
  useEffect(() => {
    try {
      localStorage.removeItem('bro_barbearia_appointments_v1');
      localStorage.removeItem('bro_barbearia_barbers_v1');
    } catch {}
  }, []);

  // Barbers list with localStorage persistence
  const [barbers, setBarbers] = useState<Barber[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BARBERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading barbers from localStorage', e);
    }
    return BARBERS;
  });

  // Sync barbers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BARBERS, JSON.stringify(barbers));
    } catch {}
  }, [barbers]);

  // Services & Combos list with localStorage persistence (starts empty/zerado as requested)
  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading services from localStorage', e);
    }
    return []; // Clean slate / zerado
  });

  // Sync services to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));
    } catch {}
  }, [services]);

  // Appointments state with localStorage persistence
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading appointments from localStorage', e);
    }
    return [];
  });

  // Sync to localStorage whenever appointments state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }, [appointments]);

  // View state: 'client' (Public booking) or 'barber-portal' (Private barber area)
  const [currentView, setCurrentView] = useState<'client' | 'barber-portal'>('client');

  // Listen for hash (#barbeiro) or URL params for direct staff access
  useEffect(() => {
    const checkStaffRoute = () => {
      if (window.location.hash === '#barbeiro' || window.location.search.includes('barbeiro')) {
        setCurrentView('barber-portal');
      }
    };
    checkStaffRoute();
    window.addEventListener('hashchange', checkStaffRoute);
    return () => window.removeEventListener('hashchange', checkStaffRoute);
  }, []);

  // Currently authenticated barber session
  const [activeBarber, setActiveBarber] = useState<Barber | null>(() => {
    try {
      const savedSession = sessionStorage.getItem(STORAGE_KEY_SESSION_BARBER);
      if (savedSession) {
        return JSON.parse(savedSession);
      }
    } catch {}
    return null;
  });

  // Booking Flow States
  const [selectedBarberId, setSelectedBarberId] = useState<string>(() => barbers[0]?.id || '');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(() => {
    return services.length > 0 ? [services[0].id] : [];
  });
  const [selectedDate, setSelectedDate] = useState<string>(() => getFormattedDateString(new Date()));
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Keep selectedBarberId in sync if a barber is registered
  useEffect(() => {
    if (barbers.length > 0 && (!selectedBarberId || !barbers.some((b) => b.id === selectedBarberId))) {
      setSelectedBarberId(barbers[0].id);
    }
  }, [barbers, selectedBarberId]);

  // Keep selectedServiceIds in sync if services change
  useEffect(() => {
    setSelectedServiceIds((prev) => {
      const valid = prev.filter((id) => services.some((s) => s.id === id));
      if (valid.length > 0) return valid;
      return services.length > 0 ? [services[0].id] : [];
    });
  }, [services]);

  // Client info
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Modals state
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Booking container ref for smooth scroll
  const bookingContainerRef = useRef<HTMLDivElement>(null);

  // Selected Barber object
  const selectedBarber = useMemo(() => {
    return barbers.find((b) => b.id === selectedBarberId) || barbers[0] || undefined;
  }, [barbers, selectedBarberId]);

  // Selected Services objects
  const selectedServices = useMemo(() => {
    return services.filter((s) => selectedServiceIds.includes(s.id));
  }, [services, selectedServiceIds]);

  // Real-time calculation of total price & duration
  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  }, [selectedServices]);

  const totalDurationMin = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.durationMin, 0);
  }, [selectedServices]);

  // Calculate current active step
  const currentStep = useMemo<number>(() => {
    if (!selectedBarberId) return 1;
    if (selectedServiceIds.length === 0) return 2;
    if (!selectedTime) return 3;
    return 4;
  }, [selectedBarberId, selectedServiceIds, selectedTime]);

  // Compute Occupied Slots Map for the currently selected Barber and Date
  const occupiedSlotsMap = useMemo(() => {
    const map: Record<string, { clientName: string; serviceSummary?: string; isBlock?: boolean; blockReason?: string }> = {};

    appointments.forEach((app) => {
      // Must match same barber, same date, and not be cancelled
      if (app.barberId === selectedBarberId && app.date === selectedDate && app.status !== 'cancelled') {
        map[app.time] = {
          clientName: app.clientName,
          serviceSummary: app.serviceNames.join(', '),
          isBlock: app.isManualBlock,
          blockReason: app.blockReason
        };
      }
    });

    return map;
  }, [appointments, selectedBarberId, selectedDate]);

  // If currently selected time becomes occupied by someone else, clear selection
  useEffect(() => {
    if (selectedTime && occupiedSlotsMap[selectedTime]) {
      setSelectedTime('');
    }
  }, [occupiedSlotsMap, selectedTime]);

  // Calculate available slots count for a barber on today's date
  const getBarberAvailableSlotsCount = (barberId: string) => {
    const todayStr = getFormattedDateString(new Date());
    const now = new Date();
    const currentH = now.getHours();
    const currentM = now.getMinutes();

    const occupiedTimes = new Set(
      appointments
        .filter((a) => a.barberId === barberId && a.date === todayStr && a.status !== 'cancelled')
        .map((a) => a.time)
    );

    let count = 0;
    OPERATING_SLOTS.forEach((time) => {
      const [h, m] = time.split(':').map(Number);
      const isPast = h < currentH || (h === currentH && m <= currentM);
      if (!isPast && !occupiedTimes.has(time)) {
        count++;
      }
    });
    return count;
  };

  // Toggle Service selection
  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) => {
      if (prev.includes(serviceId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  // Scroll to step helper
  const scrollToStep = (stepNumber: number) => {
    const ids: Record<number, string> = {
      1: 'barbeiros',
      2: 'servicos',
      3: 'horarios',
      4: 'confirmacao'
    };
    const targetElement = document.getElementById(ids[stepNumber]);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Mobile Bottom Bar Next Action
  const handleMobileProceed = () => {
    if (currentStep === 1) {
      scrollToStep(2);
    } else if (currentStep === 2) {
      scrollToStep(3);
    } else if (currentStep === 3) {
      scrollToStep(4);
    } else {
      scrollToStep(4);
    }
  };

  // Handle Booking submission
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedBarber) {
      setFormError('Por favor, selecione um barbeiro.');
      scrollToStep(1);
      return;
    }

    if (selectedServices.length === 0) {
      setFormError('Selecione pelo menos um serviço.');
      scrollToStep(2);
      return;
    }

    if (!selectedDate) {
      setFormError('Selecione a data de atendimento.');
      scrollToStep(3);
      return;
    }

    if (!selectedTime) {
      setFormError('Selecione um horário disponível na grade.');
      scrollToStep(3);
      return;
    }

    if (occupiedSlotsMap[selectedTime]) {
      setFormError('Este horário acabou de ser reservado ou está indisponível. Por favor, escolha outro horário.');
      setSelectedTime('');
      scrollToStep(3);
      return;
    }

    if (clientName.trim().length < 3) {
      setFormError('Por favor, informe seu nome completo.');
      return;
    }

    const cleanPhone = clientPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Por favor, insira um telefone válido com DDD (ex: (11) 98765-4321).');
      return;
    }

    // Generate unique code #BRO-XXXX
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newAppointment: Appointment = {
      id: `BRO-${randomCode}`,
      barberId: selectedBarber.id,
      barberName: selectedBarber.name,
      date: selectedDate,
      time: selectedTime,
      serviceIds: selectedServices.map((s) => s.id),
      serviceNames: selectedServices.map((s) => s.name),
      totalPrice,
      totalDurationMin,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientNotes: clientNotes.trim(),
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    // Play subtle audio alert for the barbershop
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now);
        gain1.gain.setValueAtTime(0.12, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.35);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.12);
        gain2.gain.setValueAtTime(0.15, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.6);
      }
    } catch {}

    // Save immediately to state and localStorage
    setAppointments((prev) => [newAppointment, ...prev]);
    
    // Open Digital Ticket Modal
    setConfirmedAppointment(newAppointment);

    // Reset selected slot and notes
    setSelectedTime('');
    setClientNotes('');
  };

  // Admin & Barber Actions
  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: 'cancelled' } : a))
    );
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: 'completed' } : a))
    );
  };

  const handleAddManualBlock = (barberId: string, date: string, time: string, reason: string) => {
    const barber = barbers.find((b) => b.id === barberId);
    const blockAppointment: Appointment = {
      id: `BLK-${Math.floor(100 + Math.random() * 900)}`,
      barberId,
      barberName: barber ? barber.name : 'Barbeiro',
      date,
      time,
      serviceIds: [],
      serviceNames: ['Bloqueio de Agenda'],
      totalPrice: 0,
      totalDurationMin: 40,
      clientName: reason || 'Bloqueio Manual',
      clientPhone: '-',
      clientNotes: reason,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      isManualBlock: true,
      blockReason: reason || 'Intervalo'
    };

    setAppointments((prev) => [blockAppointment, ...prev]);
  };

  const handleResetDemoData = () => {
    const seed = generateSeedAppointments();
    setAppointments(seed);
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(seed));
  };

  const handleClearAllData = () => {
    if (window.confirm('Tem certeza que deseja apagar todos os agendamentos registrados no navegador?')) {
      setAppointments([]);
      localStorage.removeItem(STORAGE_KEY_APPOINTMENTS);
    }
  };

  const handleScrollToBooking = () => {
    bookingContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auth Handlers for Barber Portal
  const handleBarberLogin = (barber: Barber) => {
    setActiveBarber(barber);
    try {
      sessionStorage.setItem(STORAGE_KEY_SESSION_BARBER, JSON.stringify(barber));
    } catch {}
  };

  const handleBarberLogout = () => {
    setActiveBarber(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY_SESSION_BARBER);
    } catch {}
  };

  const handleRegisterNewBarber = (newBarber: Barber) => {
    setBarbers((prev) => [...prev, newBarber]);
  };

  const handleUpdateBarberPin = (barberId: string, newPin: string) => {
    setBarbers((prev) =>
      prev.map((b) => (b.id === barberId ? { ...b, pin: newPin } : b))
    );
    if (activeBarber && activeBarber.id === barberId) {
      const updated = { ...activeBarber, pin: newPin };
      setActiveBarber(updated);
      try {
        sessionStorage.setItem(STORAGE_KEY_SESSION_BARBER, JSON.stringify(updated));
      } catch {}
    }
  };

  // Service / Combo handlers
  const handleAddService = (newService: Service) => {
    setServices((prev) => [...prev, newService]);
    setSelectedServiceIds((prev) => (prev.length === 0 ? [newService.id] : prev));
  };

  const handleUpdateService = (updated: Service) => {
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    setSelectedServiceIds((prev) => prev.filter((id) => id !== serviceId));
  };

  const handleResetAllServices = () => {
    setServices([]);
    setSelectedServiceIds([]);
    try {
      localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify([]));
    } catch {}
  };

  const activeBookingsCount = useMemo(() => {
    return appointments.filter((a) => a.status === 'confirmed' && !a.isManualBlock).length;
  }, [appointments]);

  // ========================================================
  // RENDER VIEW: DEDICATED BARBER PORTAL (PRIVACY MODE)
  // ========================================================
  if (currentView === 'barber-portal') {
    return (
      <BarberPortal
        barbers={barbers}
        appointments={appointments}
        activeBarber={activeBarber}
        services={services}
        onLogin={handleBarberLogin}
        onLogout={handleBarberLogout}
        onBackToClientSite={() => {
          setCurrentView('client');
          if (window.location.hash === '#barbeiro') {
            history.replaceState(null, '', window.location.pathname);
          }
        }}
        onRegisterBarber={handleRegisterNewBarber}
        onUpdateBarberPin={handleUpdateBarberPin}
        onCancelAppointment={handleCancelAppointment}
        onCompleteAppointment={handleCompleteAppointment}
        onAddManualBlock={handleAddManualBlock}
        onAddService={handleAddService}
        onUpdateService={handleUpdateService}
        onDeleteService={handleDeleteService}
        onResetAllServices={handleResetAllServices}
      />
    );
  }

  // ========================================================
  // RENDER VIEW: CLIENT BOOKING SITE (PUBLIC)
  // ========================================================
  return (
    <div className="relative min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Dynamic Animated Ambient Background */}
      <AnimatedBackground />

      {/* Content wrapper with relative elevation */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Top Header */}
        <Header
          onOpenAdmin={() => setCurrentView('barber-portal')}
        />

        {/* Hero Presentation */}
        <HeroSection onStartBooking={handleScrollToBooking} />

        {/* Main Single-Page Booking Flow Container */}
        <main 
          className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-16 pb-28 md:pb-16" 
          ref={bookingContainerRef}
        >
          {/* Intro Tagline & Step Progress Tracker */}
          <div className="max-w-2xl">
            <span className="text-[10px] font-mono-num uppercase tracking-widest text-zinc-400 block mb-1">
              Sistema de Reserva Exclusivo
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight uppercase">
              Fluxo de Agendamento
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 leading-relaxed">
              Siga os 4 passos abaixo para garantir seu horário com confirmação imediata.
            </p>

            {/* Quick Step Jump Tabs on Mobile & Desktop */}
            <StepIndicator
              currentStep={currentStep}
              onStepClick={scrollToStep}
              selectedBarberName={selectedBarber?.name}
              servicesCount={selectedServices.length}
              selectedTime={selectedTime}
            />
          </div>

          {/* Step 1: Barber Selection */}
          <BarberSelector
            barbers={barbers}
            selectedBarberId={selectedBarberId}
            onSelectBarber={(id) => {
              setSelectedBarberId(id);
              setSelectedTime(''); // Reset time selection when changing barber
            }}
            getBarberAvailableSlotsCount={getBarberAvailableSlotsCount}
          />

          {/* Step 2: Service Selection */}
          <ServiceSelector
            services={services}
            selectedServiceIds={selectedServiceIds}
            onToggleService={handleToggleService}
            totalPrice={totalPrice}
            totalDurationMin={totalDurationMin}
          />

          {/* Step 3: Date & Dynamic Slots Grid */}
          <ScheduleGrid
            selectedDate={selectedDate}
            onSelectDate={(d) => {
              setSelectedDate(d);
              setSelectedTime(''); // Reset time when changing date
            }}
            selectedTime={selectedTime}
            onSelectTime={(t) => setSelectedTime(t)}
            barberName={selectedBarber ? selectedBarber.name : 'A definir'}
            occupiedSlotsMap={occupiedSlotsMap}
          />

          {/* Step 4: Client Info & Final Confirmation */}
          <ClientForm
            clientName={clientName}
            setClientName={setClientName}
            clientPhone={clientPhone}
            setClientPhone={setClientPhone}
            clientNotes={clientNotes}
            setClientNotes={setClientNotes}
            selectedBarber={selectedBarber}
            selectedServices={selectedServices}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            totalPrice={totalPrice}
            totalDurationMin={totalDurationMin}
            onSubmitBooking={handleSubmitBooking}
            errorMessage={formError}
          />
        </main>

        {/* Footer */}
        <Footer onOpenAdmin={() => setCurrentView('barber-portal')} />

        {/* Sticky Mobile Action Bottom Bar */}
        <MobileBottomBar
          selectedBarber={selectedBarber}
          selectedServices={selectedServices}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          totalPrice={totalPrice}
          totalDurationMin={totalDurationMin}
          onProceed={handleMobileProceed}
          canProceed={Boolean(selectedBarber && selectedServices.length > 0)}
          stepNumber={currentStep}
        />

        {/* Digital Ticket / Receipt Modal */}
        <TicketModal
          appointment={confirmedAppointment}
          onClose={() => setConfirmedAppointment(null)}
        />

        {/* Barbershop Internal Management Panel (Optional Modal backup) */}
        <AdminPanelModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          appointments={appointments}
          barbers={barbers}
          services={services}
          onCancelAppointment={handleCancelAppointment}
          onCompleteAppointment={handleCompleteAppointment}
          onAddManualBlock={handleAddManualBlock}
          onResetDemoData={handleResetDemoData}
          onClearAllData={handleClearAllData}
          onAddService={handleAddService}
          onUpdateService={handleUpdateService}
          onDeleteService={handleDeleteService}
          onResetAllServices={handleResetAllServices}
        />
      </div>
    </div>
  );
}
