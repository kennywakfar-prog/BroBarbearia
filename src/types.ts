export interface Barber {
  id: string;
  name: string;
  nickname: string;
  role: string;
  experience: string;
  rating: number;
  reviewCount: number;
  bio: string;
  avatarInitials: string;
  specialties: string[];
  pin: string; // PIN de acesso privado (ex: "1010")
  phone?: string;
  isManager?: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: 'corte' | 'barba' | 'combo' | 'acabamento' | 'tratamento';
  price: number;
  durationMin: number;
  description: string;
  popular?: boolean;
  includes?: string[];
}

export type AppointmentStatus = 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string; // e.g. "BRO-4891"
  barberId: string;
  barberName: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  serviceIds: string[];
  serviceNames: string[];
  totalPrice: number;
  totalDurationMin: number;
  clientName: string;
  clientPhone: string;
  clientNotes: string;
  createdAt: string;
  status: AppointmentStatus;
  isManualBlock?: boolean;
  blockReason?: string;
}

export interface TimeSlot {
  time: string; // "09:00"
  isOccupied: boolean;
  occupiedBy?: {
    clientName: string;
    serviceSummary?: string;
    isBlock?: boolean;
    blockReason?: string;
  };
  isPast: boolean;
}
