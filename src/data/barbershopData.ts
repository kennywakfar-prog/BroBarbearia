import { Barber, Service, Appointment } from '../types';

// Empty initial barbers as requested (barbers will be registered now)
export const BARBERS: Barber[] = [];

// Empty initial services/combos as requested (user will create combos and choose prices)
export const SERVICES: Service[] = [];

// Business hours slots: 09:00 to 19:30
export const OPERATING_SLOTS: string[] = [
  '09:00',
  '09:40',
  '10:20',
  '11:00',
  '11:40',
  '13:00',
  '13:40',
  '14:20',
  '15:00',
  '15:40',
  '16:20',
  '17:00',
  '17:40',
  '18:20',
  '19:00'
];

export const STORAGE_KEY_APPOINTMENTS = 'bro_barbearia_appointments_clean_v2';
export const STORAGE_KEY_BARBERS = 'bro_barbearia_barbers_clean_v2';
export const STORAGE_KEY_SERVICES = 'bro_barbearia_services_clean_v2';
export const STORAGE_KEY_SESSION_BARBER = 'bro_barbearia_active_barber_clean_v2';
export const MASTER_PIN = '9999';

// Format Date YYYY-MM-DD
export function getFormattedDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Clean initial appointments list (empty)
export function generateSeedAppointments(): Appointment[] {
  return [];
}

// Sugestões prontas de combos e serviços caso o usuário queira adicionar com 1 clique para personalizar
export const PRESET_COMBO_SUGGESTIONS: Omit<Service, 'id'>[] = [
  {
    name: 'Combo BRO Alfa: Cabelo + Barba',
    category: 'combo',
    price: 70,
    durationMin: 50,
    description: 'Corte tradicional ou degradê moderno + barba completa alinhada com toalha quente e navalhete.',
    popular: true,
    includes: ['Corte Máquina/Tesoura', 'Barboterapia com Toalha Quente', 'Alinhamento com Navalhete', 'Pomada Matte']
  },
  {
    name: 'Combo Completo VIP (Cabelo + Barba + Sobrancelha)',
    category: 'combo',
    price: 85,
    durationMin: 60,
    description: 'Experiência completa com corte na medida, alinhamento de barba, limpeza de sobrancelha e finalização.',
    popular: true,
    includes: ['Corte Fade ou Tesoura', 'Barboterapia & Toalha Quente', 'Design de Sobrancelha', 'Lavagem Especial', 'Finalizador Premium']
  },
  {
    name: 'Corte Tradicional BRO',
    category: 'corte',
    price: 45,
    durationMin: 35,
    description: 'Corte masculino clássico ou degradê com tesoura e máquina, finalizado com produtos de alta fixação.',
    popular: false,
    includes: ['Corte Personalizado', 'Pezinho na Navalha', 'Finalização']
  },
  {
    name: 'Barboterapia & Alinhamento',
    category: 'barba',
    price: 35,
    durationMin: 30,
    description: 'Toalha quente emoliente, barbear com navalhete descartável, óleo hidratante e massagem relaxante.',
    popular: false,
    includes: ['Toalha Quente', 'Navalhete Descartável', 'Balm e Óleo Hidratante', 'Massagem Facial']
  },
  {
    name: 'Combo Barba + Sobrancelha',
    category: 'combo',
    price: 50,
    durationMin: 35,
    description: 'Alinhamento completo da barba combinado com design de sobrancelha na lâmina.',
    popular: false,
    includes: ['Barboterapia', 'Design de Sobrancelha', 'Finalização']
  }
];
