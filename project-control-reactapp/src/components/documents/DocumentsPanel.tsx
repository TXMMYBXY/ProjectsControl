import { useState, useRef, useCallback, DragEvent } from 'react';
import { Upload, FileText, Trash2, FileImage, FileArchive, FileSpreadsheet, File, Download, Clock } from 'lucide-react';

export interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  uploadedAt: string;
  file?: File;
}

interface DocumentsPanelProps {
  projectId: number;
  projectTitle: string;
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return <FileImage size={20} className="text-purple-500" />;
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv'))
    return <FileSpreadsheet size={20} className="text-green-500" />;
  if (type.includes('zip') || type.includes('rar') || type.includes('archive'))
    return <FileArchive size={20} className="text-yellow-500" />;
  if (type.includes('pdf') || type.includes('text') || type.includes('document'))
    return <FileText size={20} className="text-red-500" />;
  return <File size={20} className="text-gray-400" />;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// Simulate stored documents per project (in real app — from API)
const documentsStore: Record<number, DocumentFile[]> = {};

export function DocumentsPanel({ projectId, projectTitle }: DocumentsPanelProps) {
  const [documents, setDocuments] = useState<DocumentFile[]>(() => documentsStore[projectId] ?? []);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const saveDocuments = (docs: DocumentFile[]) => {
    documentsStore[projectId] = docs;
    setDocuments(docs);
  };

  const processFiles = useCallback(async (files: File[]) => {
    setUploading(true);
    // Simulate upload delay (in real app — POST to API)
    await new Promise(r => setTimeout(r, 600));
    const newDocs: DocumentFile[] = files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      path: `/documents/project-${projectId}/${file.name}`,
      uploadedAt: new Date().toISOString(),
      file,
    }));
    saveDocuments([...documents, ...newDocs]);
    setUploading(false);
  }, [documents, projectId]);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) processFiles(files);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) processFiles(files);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeDocument = (id: string) => {
    saveDocuments(documents.filter(d => d.id !== id));
  };

  const downloadDocument = (doc: DocumentFile) => {
    if (doc.file) {
      const url = URL.createObjectURL(doc.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${dragging
            ? 'border-indigo-500 bg-indigo-50 scale-[1.01]'
            : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 bg-gray-50'
          }
          ${uploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={onInputChange}
        />
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <>
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-sm text-indigo-600 font-medium">Загрузка файлов...</p>
            </>
          ) : (
            <>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
                ${dragging ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                <Upload size={22} className={dragging ? 'text-indigo-600' : 'text-gray-400'} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {dragging ? 'Отпустите файлы' : 'Перетащите файлы или кликните для выбора'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Путь хранения: <code className="bg-gray-100 px-1 rounded text-indigo-600">/documents/project-{projectId}/</code>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Documents list */}
      {documents.length === 0 ? (
        <div className="text-center py-6 text-sm text-gray-400">
          <FileText size={32} className="mx-auto mb-2 opacity-30" />
          Документы для проекта «{projectTitle}» не добавлены
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Документы ({documents.length})
          </p>
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 group transition-colors"
              >
                <div className="shrink-0">{getFileIcon(doc.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{doc.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-400">{formatBytes(doc.size)}</span>
                    <span className="text-gray-200">•</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={10} />
                      {formatDate(doc.uploadedAt)}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-400 font-mono truncate mt-0.5">{doc.path}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {doc.file && (
                    <button
                      onClick={() => downloadDocument(doc)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Скачать"
                    >
                      <Download size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
