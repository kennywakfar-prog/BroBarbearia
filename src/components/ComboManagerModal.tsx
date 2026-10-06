import React from 'react';
import { Service } from '../types';
import { ComboManager } from './ComboManager';
import { X } from 'lucide-react';

interface ComboManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  onAddService: (newService: Service) => void;
  onUpdateService: (updatedService: Service) => void;
  onDeleteService: (serviceId: string) => void;
  onResetAllServices: () => void;
}

export const ComboManagerModal: React.FC<ComboManagerModalProps> = ({
  isOpen,
  onClose,
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
  onResetAllServices
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-5xl my-8 bg-zinc-950 border border-zinc-800 rounded-sm shadow-2xl p-5 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <ComboManager
          services={services}
          onAddService={onAddService}
          onUpdateService={onUpdateService}
          onDeleteService={onDeleteService}
          onResetAllServices={onResetAllServices}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
