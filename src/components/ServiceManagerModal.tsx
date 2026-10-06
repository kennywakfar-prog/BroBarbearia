import React, { useState } from 'react';
import { Service } from '../types';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Tag, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface ServiceManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  onAddService: (newService: Service) => void;
  onUpdateService: (updatedService: Service) => void;
  onDeleteService: (serviceId: string) => void;
}

export const ServiceManagerModal: React.FC<ServiceManagerModalProps> = ({
  isOpen,
  onClose,
  services,
  onAddService,
  onUpdateService,
  onDeleteService
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'combo' | 'corte' | 'barba' | 'acabamento' | 'tratamento'>('combo');
  const [priceStr, setPriceStr] = useState('');
  const [durationMin, setDurationMin] = useState(45);
  const [description, setDescription] = useState('');
  const [popular, setPopular] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartEdit = (service: Service) => {
    setEditingId(service.id);
    setName(service.name);
    setCategory(service.category);
    setPriceStr(service.price.toString());
    setDurationMin(service.durationMin);
    setDescription(service.description);
    setPopular(Boolean(service.popular));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setCategory('combo');
    setPriceStr('');
    setDurationMin(45);
    setDescription('');
    setPopular(false);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Informe o nome do combo ou serviço.');
      return;
    }

    const priceNum = parseFloat(priceStr.replace(',', '.')) || 0;

    if (editingId) {
      // Update
      const updated: Service = {
        id: editingId,
        name: name.trim(),
        category,
        price: priceNum,
        durationMin: Number(durationMin) || 30,
        description: description.trim(),
        popular
      };
      onUpdateService(updated);
      handleCancelEdit();
    } else {
      // Create
      const newService: Service = {
        id: `service-${Date.now()}`,
        name: name.trim(),
        category,
        price: priceNum,
        durationMin: Number(durationMin) || 30,
        description: description.trim(),
        popular
      };
      onAddService(newService);
      handleCancelEdit();
    }
  };

  // Quick preset templates to assist the user
  const handleApplyPreset = (presetName: string, presetCat: 'combo' | 'corte' | 'barba', defDur: number, defDesc: string) => {
    setName(presetName);
    setCategory(presetCat);
    setDurationMin(defDur);
    setDescription(defDesc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-sm shadow-2xl text-zinc-100 my-4 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-black border-b border-zinc-800 shrink-0">
          <div>
            <h2 className="font-display font-extrabold text-base tracking-tight text-white flex items-center gap-2">
              GERENCIADOR DE COMBOS & SERVIÇOS
              <span className="text-[10px] font-mono-num font-normal px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                {services.length} {services.length === 1 ? 'item cadastrado' : 'itens cadastrados'}
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">
              Crie os combos da barbearia, defina os valores em R$, duração e a descrição de cada serviço.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-sm transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Creation / Edit Form Card */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 bg-zinc-900/70 border border-zinc-800 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                {editingId ? 'Editar Combo / Serviço' : 'Criar Novo Combo ou Serviço'}
              </span>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-[11px] text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancelar Edição
                </button>
              )}
            </div>

            {/* Quick preset suggestions */}
            {!editingId && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
                  Sugestões Rápidas de Modelo (clique para preencher):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Combo BRO Completo (Corte + Barba)', 'combo', 60, 'Corte na máquina e tesoura + barba esculpida na navalha com toalha quente e balm.')}
                    className="px-2 py-1 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[10px] rounded cursor-pointer"
                  >
                    + Combo Corte + Barba
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Corte Masculino na Navalha & Tesoura', 'corte', 40, 'Degradê na navalha ou corte clássico na tesoura, finalizado com pomada matte.')}
                    className="px-2 py-1 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[10px] rounded cursor-pointer"
                  >
                    + Corte Masculino
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Barboterapia com Toalha Quente & Ozônio', 'barba', 35, 'Alinhamento na lâmina, toalha aquecida, vapor de ozônio, hidratação e pós-barba.')}
                    className="px-2 py-1 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[10px] rounded cursor-pointer"
                  >
                    + Barba com Toalha Quente
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('Pezinho & Sobrancelha', 'acabamento' as any, 20, 'Acabamento minucioso dos contornos na navalha e limpeza de sobrancelhas.')}
                    className="px-2 py-1 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[10px] rounded cursor-pointer"
                  >
                    + Pezinho & Sobrancelha
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  Nome do Combo / Serviço *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Combo BRO (Cabelo + Barba)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-white"
                >
                  <option value="combo">Combo Especial</option>
                  <option value="corte">Corte de Cabelo</option>
                  <option value="barba">Barba / Barboterapia</option>
                  <option value="acabamento">Acabamento / Outros</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  Valor em Reais (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono-num">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    placeholder="0,00"
                    value={priceStr}
                    onChange={(e) => setPriceStr(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-xs text-white font-mono-num focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  Tempo Estimado (minutos)
                </label>
                <input
                  type="number"
                  step="5"
                  min="5"
                  max="180"
                  value={durationMin}
                  onChange={(e) => setDurationMin(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded text-xs text-white font-mono-num focus:outline-none focus:border-white"
                />
              </div>

              {/* Popular Checkbox */}
              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={popular}
                    onChange={(e) => setPopular(e.target.checked)}
                    className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-white focus:ring-0 cursor-pointer"
                  />
                  <span>Destacar como "Mais Pedido"</span>
                </label>
              </div>

              {/* Description / O jeito do combo */}
              <div className="sm:col-span-3">
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  O que está incluso no combo / Descrição do serviço
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Corte completo (máquina e tesoura) + Barba alinhada com toalha quente, ozônio, óleo essencial e finalização com pomada matte."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white resize-none"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-950/70 border border-red-900 rounded text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-2 bg-white text-black hover:bg-zinc-200 font-display font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{editingId ? 'Salvar Alterações' : 'Adicionar Combo / Serviço'}</span>
              </button>
            </div>
          </form>

          {/* Current Services List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Catálogo Atual de Combos e Serviços ({services.length})
            </h3>

            {services.length === 0 ? (
              <div className="p-8 bg-zinc-950 border border-zinc-800 rounded-sm text-center text-zinc-400 space-y-2">
                <p className="text-sm font-semibold text-zinc-300">
                  Nenhum combo cadastrado no momento.
                </p>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Use o formulário acima para criar seus combos, definir os valores e o tempo estimado para cada um.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-zinc-950 border border-zinc-800/90 rounded-sm flex flex-col justify-between hover:border-zinc-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <h4 className="font-display font-bold text-sm text-white">
                            {item.name}
                          </h4>
                          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono-num">
                            Categoria: {item.category}
                          </span>
                        </div>
                        {item.popular && (
                          <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-300 text-[9px] font-bold uppercase tracking-wider rounded">
                            Popular
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                        {item.description || 'Sem descrição.'}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono-num font-bold text-white text-sm">
                          {item.price > 0 ? `R$ ${item.price.toFixed(2).replace('.', ',')}` : 'Valor a definir'}
                        </span>
                        <span className="text-zinc-500 text-[11px] font-mono-num">
                          {item.durationMin} min
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors cursor-pointer"
                          title="Editar combo"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteService(item.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                          title="Excluir combo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-black border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <span>Os combos cadastrados aqui aparecem imediatamente para os clientes agendarem.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
