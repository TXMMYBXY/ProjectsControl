import { useState, useRef, useEffect } from 'react';
import { Search, X, Check, ChevronDown } from 'lucide-react';

export function SearchableMultiSelect({ items, selectedIds, onChange, placeholder = 'Выберите...', getLabel, getId }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = items.filter(item =>
    getLabel(item).toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (id) => {
    if (selectedIds.includes(id)) onChange(selectedIds.filter(s => s !== id));
    else onChange([...selectedIds, id]);
  };

  const selectedItems = items.filter(item => selectedIds.includes(getId(item)));

  return (
    <div ref={ref} className="relative">
      <div
        className="min-h-[38px] w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-indigo-400 bg-white cursor-pointer flex flex-wrap gap-1 items-center"
        onClick={() => setOpen(o => !o)}
      >
        {selectedItems.length === 0 ? (
          <span className="text-gray-400 text-sm py-0.5">{placeholder}</span>
        ) : (
          selectedItems.map(item => (
            <span
              key={getId(item)}
              className="flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full"
              onClick={e => { e.stopPropagation(); toggle(getId(item)); }}
            >
              {getLabel(item)}
              <X size={10} className="hover:text-indigo-900" />
            </span>
          ))
        )}
        <ChevronDown size={14} className={`ml-auto text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Поиск..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onClick={e => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Ничего не найдено</p>
            ) : (
              filtered.map(item => {
                const id = getId(item);
                const selected = selectedIds.includes(id);
                return (
                  <div
                    key={id}
                    onClick={() => toggle(id)}
                    className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition
                      ${selected ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition
                      ${selected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                      {selected && <Check size={10} className="text-white" />}
                    </div>
                    <span className="truncate">{getLabel(item)}</span>
                  </div>
                );
              })
            )}
          </div>
          {selectedIds.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <button
                onClick={() => onChange([])}
                className="w-full text-xs text-gray-400 hover:text-red-500 py-1 transition"
              >
                Очистить выбор ({selectedIds.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SearchableSingleSelect({ items, value, onChange, placeholder = 'Выберите...', getLabel, getId, nullable = true }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = items.filter(item =>
    getLabel(item).toLowerCase().includes(query.toLowerCase())
  );

  const selected = items.find(item => getId(item) === value);

  return (
    <div ref={ref} className="relative">
      <div
        className="h-[38px] w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-indigo-400 bg-white cursor-pointer flex items-center justify-between gap-2"
        onClick={() => setOpen(o => !o)}
      >
        {selected ? (
          <span className="text-gray-800 truncate">{getLabel(selected)}</span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <div className="flex items-center gap-1 shrink-0">
          {selected && nullable && (
            <button
              onClick={e => { e.stopPropagation(); onChange(null); }}
              className="text-gray-300 hover:text-gray-500 transition"
            >
              <X size={12} />
            </button>
          )}
          <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Поиск..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onClick={e => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {nullable && (
              <div
                onClick={() => { onChange(null); setOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm text-gray-400 hover:bg-gray-50 italic"
              >
                — Не назначен —
              </div>
            )}
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Ничего не найдено</p>
            ) : (
              filtered.map(item => {
                const id = getId(item);
                const isSelected = value === id;
                return (
                  <div
                    key={id}
                    onClick={() => { onChange(id); setOpen(false); setQuery(''); }}
                    className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition
                      ${isSelected ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition
                      ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="truncate">{getLabel(item)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
