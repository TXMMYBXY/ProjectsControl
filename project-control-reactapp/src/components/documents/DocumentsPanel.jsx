import { useState, useRef, useCallback, useMemo } from 'react';
import {
  Upload, FileText, FileImage, FileArchive, FileSpreadsheet,
  File, CheckCircle, XCircle, Loader2, Download, Search,
  RefreshCw, SortAsc, SortDesc, X, AlertCircle,
} from 'lucide-react';
import { documentsApi } from '../../api/index.js';

// ─── иконка по расширению ──────────────────────────────────────────────────
function getFileIcon(name, size = 18) {
  const ext = (name ?? '').split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext))
    return <FileImage size={size} className="text-purple-500" />;
  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext))
    return <FileSpreadsheet size={size} className="text-green-600" />;
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext))
    return <FileArchive size={size} className="text-amber-500" />;
  if (['pdf', 'doc', 'docx', 'txt', 'odt', 'rtf', 'md'].includes(ext))
    return <FileText size={size} className="text-red-500" />;
  return <File size={size} className="text-gray-400" />;
}

// ─── форматирование размера ────────────────────────────────────────────────
function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

// ─── расширение файла ──────────────────────────────────────────────────────
function getExt(name) {
  const parts = (name ?? '').split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

let nextId = 1;

// ─── одна строка в очереди загрузки ───────────────────────────────────────
function QueueItem({ item, onRetry, onRemove }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 transition-colors group
      ${item.status === 'error' ? 'bg-red-50' : item.status === 'done' ? 'bg-emerald-50/60' : 'bg-white'}`}
    >
      <div className="shrink-0 w-5 flex items-center justify-center">
        {item.status === 'uploading' && <Loader2 size={16} className="text-indigo-400 animate-spin" />}
        {item.status === 'done'     && <CheckCircle size={16} className="text-emerald-500" />}
        {item.status === 'error'    && <XCircle size={16} className="text-red-400" />}
      </div>
      <div className="shrink-0">{getFileIcon(item.file.name, 16)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 truncate font-medium">{item.file.name}</p>
        <div className="flex items-center gap-2 mt-0.5 text-xs flex-wrap">
          <span className="text-gray-400">{formatBytes(item.file.size)}</span>
          {item.status === 'uploading' && <span className="text-indigo-500">Загрузка на сервер…</span>}
          {item.status === 'done'      && <span className="text-emerald-600">Загружено</span>}
          {item.status === 'error'     && <span className="text-red-500 truncate max-w-xs">{item.error}</span>}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {item.status === 'error' && (
          <button
            onClick={() => onRetry(item.id)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-100 rounded-lg transition font-medium"
          >
            <RefreshCw size={11} /> Повторить
          </button>
        )}
        {item.status !== 'uploading' && (
          <button
            onClick={() => onRemove(item.id)}
            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            title="Убрать из списка"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── одна строка существующего документа ──────────────────────────────────
function DocumentRow({ doc, onDownload, downloading }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
      <div className="shrink-0">{getFileIcon(doc.fileName, 18)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 font-medium truncate" title={doc.fileName}>
          {doc.fileName ?? `Документ #${doc.id}`}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">#{doc.id} · {getExt(doc.fileName).toUpperCase() || 'Файл'}</p>
      </div>
      <button
        onClick={() => onDownload(doc)}
        disabled={downloading === doc.id}
        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition
          ${downloading === doc.id
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 group-hover:shadow-sm'}`}
        title="Скачать файл"
      >
        {downloading === doc.id
          ? <Loader2 size={13} className="animate-spin" />
          : <Download size={13} />}
        {downloading === doc.id ? 'Скачивание…' : 'Скачать'}
      </button>
    </div>
  );
}

// ─── основной компонент ────────────────────────────────────────────────────
export function DocumentsPanel({ projectId, projectTitle, initialDocuments = [], onUploaded }) {
  // -- существующие документы
  const [documents, setDocuments]     = useState(initialDocuments);
  const [docSearch, setDocSearch]     = useState('');
  const [docSort, setDocSort]         = useState('name'); // 'name' | 'id'
  const [docSortDir, setDocSortDir]   = useState('asc');
  const [downloading, setDownloading] = useState(null); // id скачиваемого
  const [downloadError, setDownloadError] = useState(null);

  // -- очередь загрузки
  const [queue, setQueue]   = useState([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const uploadingCount = queue.filter(i => i.status === 'uploading').length;
  const doneCount      = queue.filter(i => i.status === 'done').length;
  const errorCount     = queue.filter(i => i.status === 'error').length;

  // -- фильтрация и сортировка документов
  const filteredDocs = useMemo(() => {
    let list = documents.filter(d =>
      (d.fileName ?? '').toLowerCase().includes(docSearch.toLowerCase())
    );
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (docSort === 'name') cmp = (a.fileName ?? '').localeCompare(b.fileName ?? '');
      if (docSort === 'id')   cmp = a.id - b.id;
      return docSortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [documents, docSearch, docSort, docSortDir]);

  const toggleSort = (field) => {
    if (docSort === field) setDocSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setDocSort(field); setDocSortDir('asc'); }
  };

  // -- скачать документ
  const handleDownload = async (doc) => {
    setDownloadError(null);
    setDownloading(doc.id);
    try {
      await documentsApi.download(doc.id, doc.fileName);
    } catch (e) {
      setDownloadError(`Ошибка скачивания «${doc.fileName}»: ${e.message}`);
    } finally {
      setDownloading(null);
    }
  };

  // -- загрузить файл
  const updateItem = (id, patch) =>
    setQueue(q => q.map(item => item.id === id ? { ...item, ...patch } : item));

  const uploadFile = useCallback(async (file) => {
    const id = nextId++;
    setQueue(q => [...q, { id, file, status: 'uploading', error: null }]);
    try {
      await documentsApi.upload(projectId, file);
      updateItem(id, { status: 'done' });
      // Уведомляем родителя, чтобы он рефетчил проект и получил обновлённый список
      if (onUploaded) onUploaded();
    } catch (err) {
      updateItem(id, { status: 'error', error: err.message ?? 'Ошибка загрузки' });
    }
  }, [projectId, onUploaded]);

  const processFiles = useCallback((files) => {
    files.forEach(file => uploadFile(file));
  }, [uploadFile]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) processFiles(files);
  };
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onInputChange = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) processFiles(files);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeItem = (id) => setQueue(q => q.filter(i => i.id !== id));
  const retryItem  = (id) => {
    const item = queue.find(i => i.id === id);
    if (!item) return;
    removeItem(id);
    uploadFile(item.file);
  };

  const SortBtn = ({ field, label }) => (
    <button
      onClick={() => toggleSort(field)}
      className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border transition
        ${docSort === field
          ? 'border-indigo-300 bg-indigo-50 text-indigo-700 font-medium'
          : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
    >
      {label}
      {docSort === field
        ? (docSortDir === 'asc' ? <SortAsc size={11} /> : <SortDesc size={11} />)
        : <SortAsc size={11} className="text-gray-300" />}
    </button>
  );

  return (
    <div className="flex flex-col gap-6">

      {/* ── Зона загрузки ─────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Upload size={13} /> Загрузить новые файлы
        </p>

        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !uploadingCount && inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
            ${dragging
              ? 'border-indigo-500 bg-indigo-50 scale-[1.01]'
              : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/40 bg-gray-50/80'}
            ${uploadingCount > 0 ? 'pointer-events-none opacity-70' : ''}`}
        >
          <input ref={inputRef} type="file" multiple className="hidden" onChange={onInputChange} />
          <div className="flex flex-col items-center gap-2">
            {uploadingCount > 0 ? (
              <>
                <Loader2 size={26} className="text-indigo-500 animate-spin" />
                <p className="text-sm text-indigo-600 font-medium">
                  Загрузка {uploadingCount} файл{uploadingCount === 1 ? 'а' : 'ов'}…
                </p>
              </>
            ) : (
              <>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                  ${dragging ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                  <Upload size={18} className={dragging ? 'text-indigo-600' : 'text-gray-400'} />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {dragging ? 'Отпустите файлы' : 'Перетащите файлы или нажмите для выбора'}
                </p>
                <p className="text-xs text-gray-400">Любые форматы, несколько файлов одновременно</p>
              </>
            )}
          </div>
        </div>

        {/* Статистика очереди */}
        {queue.length > 0 && (
          <div className="mt-2 flex items-center gap-4 px-1">
            {uploadingCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
                <Loader2 size={11} className="animate-spin" /> Загружается: {uploadingCount}
              </span>
            )}
            {doneCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <CheckCircle size={11} /> Готово: {doneCount}
              </span>
            )}
            {errorCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                <XCircle size={11} /> Ошибок: {errorCount}
              </span>
            )}
            {queue.some(i => i.status !== 'uploading') && (
              <button
                onClick={() => setQueue(q => q.filter(i => i.status === 'uploading'))}
                className="ml-auto text-xs text-gray-400 hover:text-gray-600 transition"
              >
                Очистить список
              </button>
            )}
          </div>
        )}

        {/* Очередь файлов */}
        {queue.length > 0 && (
          <div className="mt-2 border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
            {queue.map(item => (
              <QueueItem key={item.id} item={item} onRetry={retryItem} onRemove={removeItem} />
            ))}
          </div>
        )}
      </div>

      {/* ── Список документов проекта ──────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
            <FileText size={13} />
            Документы проекта
            {documents.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs rounded-full font-semibold">
                {documents.length}
              </span>
            )}
          </p>
          {documents.length > 0 && (
            <div className="flex items-center gap-2">
              <SortBtn field="name" label="По имени" />
              <SortBtn field="id"   label="По ID" />
            </div>
          )}
        </div>

        {/* Поиск — только если документов больше 5 */}
        {documents.length > 5 && (
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={docSearch}
              onChange={e => setDocSearch(e.target.value)}
              placeholder="Поиск по названию файла…"
              className="w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            />
            {docSearch && (
              <button
                onClick={() => setDocSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Ошибка скачивания */}
        {downloadError && (
          <div className="mb-3 flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span className="flex-1">{downloadError}</span>
            <button onClick={() => setDownloadError(null)} className="text-red-400 hover:text-red-600">
              <X size={13} />
            </button>
          </div>
        )}

        {/* Пустое состояние */}
        {documents.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-gray-50/60 rounded-xl border border-gray-100">
            <FileText size={34} className="mx-auto mb-2 opacity-25" />
            <p className="text-sm font-medium">Документы не добавлены</p>
            <p className="text-xs mt-1 text-gray-300">Загрузите файлы через форму выше</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Search size={26} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">По запросу «{docSearch}» ничего не найдено</p>
          </div>
        ) : (
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            {/* Шапка */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs text-gray-400 font-medium">
              <span className="w-5 shrink-0" />
              <span className="flex-1">Файл</span>
              <span className="w-24 text-right">Действия</span>
            </div>

            {/* Список с прокруткой — max ~10 строк */}
            <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto scrollbar-thin">
              {filteredDocs.map(doc => (
                <DocumentRow
                  key={doc.id}
                  doc={doc}
                  onDownload={handleDownload}
                  downloading={downloading}
                />
              ))}
            </div>

            {/* Футер со счётчиком при поиске */}
            {docSearch && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                Показано {filteredDocs.length} из {documents.length}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
