import React, { useState } from 'react';
import { Service } from '../types';
import { PRESET_COMBO_SUGGESTIONS } from '../data/barbershopData';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  Check, 
  RotateCcw, 
  X, 
  Tag, 
  DollarSign, 
  Layers, 
  Scissors, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface ComboManagerProps {
  services: Service[];
  onAddService: (newService: Service) => void;
  onUpdateService: (updatedService: Service) => void;
  onDeleteService: (serviceId: string) => void;
  onResetAllServices: () => void;
  onClose?: () => void;
}

const COMMON_ITEMS = [
  'Corte na Máquina/Tesoura',
  'Barboterapia com Toalha Quente',
  'Alinhamento com Navalhete',
  'Lavagem Especial com Shampoo',
  'Pomada Matte ou Efeito Seco',
  'Balm & Óleo Hidratante de Barba',
  'Design de Sobrancelha na Lâmina',
  'Massagem Capilar ou Facial',
  'Café Expresso / Bebida Cortesia'
];

export const ComboManager: React.FC<ComboManagerProps> = ({
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
  onResetAllServices,
  onClose
}) => {
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'combo' | 'corte' | 'barba' | 'acabamento' | 'tratamento'>('combo');
  const [price, setPrice] = useState<string>('70');
  const [durationMin, setDurationMin] = useState<string>('50');
  const [description, setDescription] = useState('');
  const [popular, setPopular] = useState(true);
  const [selectedIncludes, setSelectedIncludes] = useState<string[]>([
    'Corte na Máquina/Tesoura',
    'Barboterapia com Toalha Quente'
  ]);
  const [customIncludeInput, setCustomIncludeInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Confirmation modal state for resetting all combos
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Populate form for editing
  const handleStartEdit = (service: Service) => {
    setEditingId(service.id);
    setName(service.name);
    setCategory(service.category);
    setPrice(String(service.price));
    setDurationMin(String(service.durationMin));
    setDescription(service.description);
    setPopular(Boolean(service.popular));
    setSelectedIncludes(service.includes || []);
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form to blank
  const handleClearForm = () => {
    setEditingId(null);
    setName('');
    setCategory('combo');
    setPrice('70');
    setDurationMin('50');
    setDescription('');
    setPopular(false);
    setSelectedIncludes([]);
    setCustomIncludeInput('');
    setFormError(null);
  };

  // Toggle included items
  const handleToggleInclude = (item: string) => {
    setSelectedIncludes((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Add custom included item
  const handleAddCustomInclude = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customIncludeInput.trim();
    if (!trimmed) return;
    if (!selectedIncludes.includes(trimmed)) {
      setSelectedIncludes((prev) => [...prev, trimmed]);
    }
    setCustomIncludeInput('');
  };

  // Submit create or edit
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setFormError('Informe o nome do combo ou serviço.');
      return;
    }

    const numericPrice = parseFloat(price.replace(',', '.'));
    if (isNaN(numericPrice) || numericPrice < 0) {
      setFormError('Informe um valor de preço válido (ex: 60.00).');
      return;
    }

    const numericDuration = parseInt(durationMin, 10);
    if (isNaN(numericDuration) || numericDuration <= 0) {
      setFormError('Informe uma duração estimada em minutos (ex: 45).');
      return;
    }

    if (editingId) {
      const updated: Service = {
        id: editingId,
        name: cleanName,
        category,
        price: numericPrice,
        durationMin: numericDuration,
        description: description.trim() || `${cleanName} - Atendimento com padrão BRO Barbearia`,
        popular,
        includes: selectedIncludes
      };
      onUpdateService(updated);
      setSuccessNotice(`Combo "${cleanName}" atualizado com sucesso!`);
    } else {
      const created: Service = {
        id: `srv-${Date.now()}`,
        name: cleanName,
        category,
        price: numericPrice,
        durationMin: numericDuration,
        description: description.trim() || `${cleanName} - Atendimento com padrão BRO Barbearia`,
        popular,
        includes: selectedIncludes
      };
      onAddService(created);
      setSuccessNotice(`Combo "${cleanName}" criado com sucesso!`);
    }

    handleClearForm();
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  // Load a preset template
  const handleApplyPreset = (preset: typeof PRESET_COMBO_SUGGESTIONS[0]) => {
    const newService: Service = {
      id: `srv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: preset.name,
      category: preset.category,
      price: preset.price,
      durationMin: preset.durationMin,
      description: preset.description,
      popular: preset.popular,
      includes: preset.includes
    };
    onAddService(newService);
    setSuccessNotice(`Modelo "${preset.name}" adicionado! Você pode editar os valores.`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-sm bg-white text-black font-black text-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
              Área de Combos & Serviços
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Crie novos combos da barbearia, defina os valores em reais (R$), o tempo estimado de atendimento e monte o jeito exclusivo de cada serviço.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Reset All Combos Button */}
          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-red-400 bg-zinc-950 border border-zinc-800 hover:border-red-900/60 rounded-sm transition-all cursor-pointer"
            title="Zerar todos os combos cadastrados"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Zerar Combos</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-sm transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal to Zero Combos */}
      {showConfirmReset && (
        <div className="p-4 sm:p-5 rounded-sm bg-red-950/40 border border-red-800/60 backdrop-blur-md animate-in fade-in space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-display font-bold text-sm text-white">
                Deseja zerar todos os combos cadastrados?
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Essa ação deixará a lista de combos totalmente limpa (zerada). Você poderá criar seus próprios combos e definir todos os valores do zero.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowConfirmReset(false)}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-sm cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onResetAllServices();
                setShowConfirmReset(false);
                setSuccessNotice('Todos os combos foram zerados com sucesso!');
                setTimeout(() => setSuccessNotice(null), 3000);
              }}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 rounded-sm transition-colors cursor-pointer"
            >
              Confirmar e Zerar
            </button>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successNotice && (
        <div className="p-3.5 rounded-sm bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Form: Create or Edit Combo ("Escolher os valores e o jeito do combo") */}
      <div className="p-5 sm:p-7 rounded-sm bg-zinc-950 border border-zinc-800 relative shadow-2xl">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            {editingId ? (
              <Edit3 className="w-4 h-4 text-amber-400" />
            ) : (
              <Plus className="w-4 h-4 text-white" />
            )}
            <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight">
              {editingId ? 'Editar Combo / Serviço' : 'Criar Novo Combo Personalizado'}
            </h3>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={handleClearForm}
              className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
            >
              Cancelar Edição
            </button>
          )}
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitForm} className="space-y-6">
          {/* Row 1: Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block">
                Nome do Combo ou Serviço *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Combo BRO Alfa (Cabelo + Barba + Sobrancelha)"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 focus:border-white focus:outline-none rounded-sm text-sm text-white placeholder-zinc-500 font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 focus:border-white focus:outline-none rounded-sm text-sm text-white font-medium cursor-pointer"
              >
                <option value="combo">👑 Combo Especial</option>
                <option value="corte">✂️ Corte de Cabelo</option>
                <option value="barba">🪒 Barba & Navalha</option>
                <option value="acabamento">📐 Acabamento & Sobrancelha</option>
                <option value="tratamento">💆 Tratamento & Terapia</option>
              </select>
            </div>
          </div>

          {/* Row 2: Values (Preço em R$) & Estimated Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price configuration */}
            <div className="space-y-1.5 p-4 bg-zinc-900/60 border border-zinc-800 rounded-sm">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                <span>Valor / Preço (R$) *</span>
                <span className="text-[10px] text-zinc-400 font-normal">Cobrado do cliente</span>
              </label>
              
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">
                  R$
                </span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="70.00"
                  className="w-full pl-11 pr-3.5 py-2.5 bg-black border border-zinc-700 focus:border-white focus:outline-none rounded-sm text-lg font-mono-num font-bold text-white placeholder-zinc-500"
                  required
                />
              </div>

              {/* Quick Price Presets */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Ajuste rápido:</span>
                {[35, 45, 60, 70, 85, 100, 120].map((quickVal) => (
                  <button
                    key={quickVal}
                    type="button"
                    onClick={() => setPrice(String(quickVal))}
                    className={`px-2 py-0.5 text-[11px] font-mono-num rounded-sm border transition-colors cursor-pointer ${
                      Number(price) === quickVal
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    R$ {quickVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration configuration */}
            <div className="space-y-1.5 p-4 bg-zinc-900/60 border border-zinc-800 rounded-sm">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                <span>Tempo de Atendimento *</span>
                <span className="text-[10px] text-zinc-400 font-normal">Duração na agenda</span>
              </label>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">
                  <Clock className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  step="5"
                  min="10"
                  max="240"
                  value={durationMin}
                  onChange={(e) => setDurationMin(e.target.value)}
                  placeholder="50"
                  className="w-full pl-11 pr-14 py-2.5 bg-black border border-zinc-700 focus:border-white focus:outline-none rounded-sm text-lg font-mono-num font-bold text-white placeholder-zinc-500"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400">
                  minutos
                </span>
              </div>

              {/* Quick Duration Presets */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Minutos:</span>
                {[20, 30, 40, 50, 60, 75, 90].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDurationMin(String(dur))}
                    className={`px-2 py-0.5 text-[11px] font-mono-num rounded-sm border transition-colors cursor-pointer ${
                      Number(durationMin) === dur
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    {dur}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: O Jeito do Combo (Descrição & Itens Inclusos) */}
          <div className="space-y-3 p-4 sm:p-5 bg-zinc-900/40 border border-zinc-800/80 rounded-sm">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-200 block mb-1">
                O Jeito do Combo (Descrição do Atendimento)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Descreva o ritual do combo: tipo de corte, toalha quente, navalha, produtos e finalização..."
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 focus:border-white focus:outline-none rounded-sm text-xs sm:text-sm text-white placeholder-zinc-500"
              />
            </div>

            {/* O que inclui no combo (Itens / Tags) */}
            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  O que está incluso no Combo (Itens do pacote):
                </span>
                <span className="text-[11px] text-zinc-400">
                  {selectedIncludes.length} itens selecionados
                </span>
              </div>

              {/* Quick Item Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                {COMMON_ITEMS.map((item) => {
                  const isChecked = selectedIncludes.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggleInclude(item)}
                      className={`px-3 py-2 text-xs rounded-sm border flex items-center gap-2 text-left transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-zinc-850 border-white text-white font-medium'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center border shrink-0 ${
                        isChecked ? 'bg-white text-black border-white' : 'border-zinc-700 bg-zinc-900'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="truncate">{item}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Included Item */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={customIncludeInput}
                  onChange={(e) => setCustomIncludeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomInclude();
                    }
                  }}
                  placeholder="Adicionar outro item personalizado (ex: Limpeza Facial com Argila)..."
                  className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-700 focus:border-white focus:outline-none rounded-sm text-xs text-white placeholder-zinc-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomInclude()}
                  className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 rounded-sm transition-colors cursor-pointer shrink-0"
                >
                  + Adicionar Item
                </button>
              </div>

              {/* Selected custom items tags */}
              {selectedIncludes.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {selectedIncludes.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-900 text-zinc-200 border border-zinc-700 text-[11px] rounded-sm"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleInclude(item)}
                        className="text-zinc-400 hover:text-white cursor-pointer ml-1"
                        title="Remover"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 4: Popular Highlight & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={popular}
                onChange={(e) => setPopular(e.target.checked)}
                className="w-4 h-4 rounded-xs bg-zinc-900 border-zinc-700 text-white focus:ring-0 cursor-pointer"
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Marcar como Combo Destaque / Mais Pedido (Badge Popular ⭐)
              </span>
            </label>

            <div className="flex items-center gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-sm cursor-pointer"
                >
                  Cancelar
                </button>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 rounded-sm transition-all shadow-lg shadow-white/10 cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{editingId ? 'Salvar Alterações' : 'Cadastrar Combo'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Combos Cadastrados List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-400" />
            <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight">
              Combos & Serviços Ativos ({services.length})
            </h3>
          </div>

          <span className="text-xs text-zinc-400 font-mono-num">
            {services.length === 0 ? 'Estado: Zerado' : `${services.length} disponíveis para agendamento`}
          </span>
        </div>

        {services.length === 0 ? (
          /* Empty Slate State ("deixa zerado os combos tambem") */
          <div className="p-8 sm:p-12 bg-zinc-950/70 border border-dashed border-zinc-800 rounded-sm text-center space-y-4 backdrop-blur-md">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-400">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h4 className="font-display font-bold text-base text-white uppercase tracking-tight">
                Nenhum Combo Cadastrado (Lista Zerada)
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Você pode utilizar o formulário acima para criar os combos com os valores e características exatas da sua barbearia.
              </p>
            </div>

            {/* Quick 1-Click Template Suggestions */}
            <div className="pt-4 border-t border-zinc-800/80 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-semibold mb-3 uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Ou adicione um modelo pronto com 1 clique (para depois editar):</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {PRESET_COMBO_SUGGESTIONS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-3 bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-600 rounded-sm transition-all group cursor-pointer text-left flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                        <span className="truncate pr-2">{preset.name}</span>
                        <span className="font-mono-num text-zinc-300 font-bold shrink-0">
                          R$ {preset.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">
                        {preset.description}
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400">
                      <span>{preset.durationMin} min</span>
                      <span className="text-white group-hover:underline font-bold">+ Adicionar este</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Combos Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className={`p-5 rounded-sm border bg-zinc-950 flex flex-col justify-between transition-all relative ${
                  editingId === service.id
                    ? 'border-white ring-1 ring-white bg-zinc-900/90'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div>
                  {/* Category and badges */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {service.category === 'combo' && '👑 Combo Especial'}
                      {service.category === 'corte' && '✂️ Corte'}
                      {service.category === 'barba' && '🪒 Barba'}
                      {service.category === 'acabamento' && '📐 Acabamento'}
                      {service.category === 'tratamento' && '💆 Tratamento'}
                    </span>

                    <div className="flex items-center gap-1">
                      {service.popular && (
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white text-black rounded-sm">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="font-display font-bold text-base text-white tracking-tight mb-1.5">
                    {service.name}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    {service.description}
                  </p>

                  {/* Included items */}
                  {service.includes && service.includes.length > 0 && (
                    <div className="mb-4 pt-2.5 border-t border-zinc-800/80">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 block mb-1.5">
                        O que inclui:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {service.includes.map((inc) => (
                          <span
                            key={inc}
                            className="text-[10px] px-2 py-0.5 bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-sm"
                          >
                            ✓ {inc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer with Price, Time & Actions */}
                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-mono-num">{service.durationMin} min</span>
                    </div>
                    <div className="font-mono-num font-black text-lg text-white">
                      R$ {service.price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(service)}
                      className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-sm transition-colors cursor-pointer"
                      title="Editar preço, duração e detalhes"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Deseja excluir o combo "${service.name}"?`)) {
                          onDeleteService(service.id);
                        }
                      }}
                      className="p-2 text-zinc-400 hover:text-red-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-sm transition-colors cursor-pointer"
                      title="Excluir este combo"
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
  );
};
