// src/pages/homepage/homepage.tsx
// -----------------------------------------------------------------------------
// ChainSign ‑ Homepage
// -----------------------------------------------------------------------------
// • Belge listesini, aramayı ve durum sekmelerini gösterir.
// • Yeni belge modalı açar ve seçilen bilgileri ChooseSigner sayfasına yollar.
// • Starknet sözleşme olaylarını (DocumentSent, DocumentSigned …) watchEvents
//   ile dinler ve listeyi canlı günceller.
// -----------------------------------------------------------------------------

import { useEffect, useMemo, useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Upload,
  ChevronDown,
  ArrowLeft,
  Calendar,
  FileText,
  Clock,
  FileCheck,
  CheckCircle,
  X,
  AlertCircle,
} from 'lucide-react';

import { watchEvents } from '../services/starknet';
import { DOCUMENT_TYPES } from '../../constants/documentsTypes';
import './homepage.css';

// -----------------------------------------------------------------------------
// Tab Sekmeleri (TypeScript Literal Union ile)
// -----------------------------------------------------------------------------
const TABS = [
  { k: 'all', l: 'Tümü' },
  { k: 'created', l: 'Oluşturulan' },
  { k: 'waiting_signature', l: 'İmza Bekleyen' },
  { k: 'signed', l: 'İmzalanan' },
  { k: 'approved', l: 'Onaylanan' },
] as const;
type TabKey = typeof TABS[number]['k']; // 'all' | 'created' | ...

// -----------------------------------------------------------------------------
// Tipler
// -----------------------------------------------------------------------------

type DocStatus = 'created' | 'waiting_signature' | 'signed' | 'approved';

interface DocBase {
  id: string;
  title: string;
  owner: string;
  timestamp: string;
  status: DocStatus;
  currentSignatory: string;
  isPublic: boolean;
  ipfsHash: string;
  signatures: number;
  totalSignatories: number;
}

export interface Signatory {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'pending' | 'signed' | 'rejected';
  signDate?: string;
}

export interface Document extends DocBase {
  signatories?: Signatory[];
}

// -----------------------------------------------------------------------------
// Yardımcı UI bileşenleri
// -----------------------------------------------------------------------------

const statusIcon = (s: DocStatus) => {
  switch (s) {
    case 'created':
      return <FileText className="h-5 w-5 text-gray-500" />;
    case 'waiting_signature':
      return <Clock className="h-5 w-5 text-blue-500" />;
    case 'signed':
      return <FileCheck className="h-5 w-5 text-green-500" />;
    case 'approved':
      return <CheckCircle className="h-5 w-5 text-purple-500" />;
    default:
      return null;
  }
};

const statusBadge = (s: DocStatus) => {
  const cx = 'px-2 py-1 rounded-full text-xs font-medium';
  switch (s) {
    case 'created':
      return <span className={`${cx} bg-gray-200 text-gray-800`}>Oluşturuldu</span>;
    case 'waiting_signature':
      return <span className={`${cx} bg-blue-100 text-blue-800`}>İmza Bekliyor</span>;
    case 'signed':
      return <span className={`${cx} bg-green-100 text-green-800`}>İmzalandı</span>;
    case 'approved':
      return <span className={`${cx} bg-purple-100 text-purple-800`}>Onaylandı</span>;
    default:
      return null;
  }
};

// -----------------------------------------------------------------------------
// Ana Bileşen
// -----------------------------------------------------------------------------

export default function Homepage(): JSX.Element {
  // ------------------------------- State -----------------------------------
  const [docs, setDocs] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');

  // Detay görünümü
  const [selected, setSelected] = useState<Document | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTypeId, setNewTypeId] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [defaultFlow, setDefaultFlow] = useState<string[]>([]);

  const navigate = useNavigate();

  // --------------------------- Mock Veri (demo) ----------------------------
  useEffect(() => {
    setDocs([
      {
        id: 'DOC-001',
        title: 'Q1 Performans Raporu 2025',
        owner: 'Ahmet Yılmaz',
        timestamp: '14 Mayıs 2025',
        status: 'waiting_signature',
        currentSignatory: 'Mehmet Öz',
        isPublic: true,
        ipfsHash: 'QmXYZ...',
        signatures: 2,
        totalSignatories: 4,
      },
    ]);
  }, []);

  // --------------------------- Event Listener -----------------------------
  useEffect(() => {
    const unsub = watchEvents((ev: unknown) => {
      console.log('Starknet event', ev);
      // TODO: burada setDocs(...) ile state güncellemesi yap
    });
    return unsub;
  }, []);

  // ------------------------------ Filtre -----------------------------------
  const filteredDocs = useMemo(() => {
    return docs.filter((d) => {
      if (activeTab !== 'all' && d.status !== activeTab) return false;
      if (search && !d.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [docs, activeTab, search]);

  // ------------------------------ Handlers ---------------------------------
  const openModal = () => {
    setShowModal(true);
    setNewTitle('');
    setNewTypeId('');
    setNewFile(null);
    setDefaultFlow([]);
  };

  const handleTypeSelect = (id: string) => {
    setNewTypeId(id);
    const t = DOCUMENT_TYPES.find((d) => d.id === id);
    setDefaultFlow(t ? t.defaultSignFlow : []);
  };

  const proceedChooseSigner = () => {
    if (!newTypeId || !newFile) return;
    navigate('/chooseSigner', {
      state: {
        documentTitle: newTitle || 'Başlıksız Belge',
        documentTypeId: newTypeId,
        defaultSignFlow: defaultFlow,
        file: newFile,
      },
    });
  };

  // -------------------------------------------------------------------------
  // JSX Başlangıç
  // -------------------------------------------------------------------------

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* █████ HEADER █████ */}
      <header className="bg-white shadow">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            {selected ? 'Belge Detayı' : 'Belge Yönetimi'}
          </h1>
          {!selected && (
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Belge ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {/* New */}
              <button
                onClick={openModal}
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-1" /> Yeni Belge
              </button>
            </div>
          )}
        </div>

        {!selected && (
          <nav className="px-6 py-2 border-b flex gap-8">
            {TABS.map(({ k, l }) => (
              <button
                key={k}
                onClick={() => setActiveTab(k)}
                className={`pb-2 text-sm font-medium ${
                  activeTab === k
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {l}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* █████ MAIN █████ */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Detay görünümü */}
        {selected ? (
          <div className="bg-white rounded-lg shadow">
            <div className="border-b p-4">
              <button
                onClick={() => setSelected(null)}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-3"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Listeye Dön
              </button>
              <div className="flex items-center gap-2">
                {statusIcon(selected.status)}
                <h2 className="text-lg font-medium">{selected.title}</h2>
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                {statusBadge(selected.status)}
                <span>ID: {selected.id}</span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> {selected.timestamp}
                </span>
              </div>
            </div>
            <div className="p-8 text-center text-gray-500">
              Belge içerik önizleme alanı (demo)
            </div>
          </div>
        ) : (
          /* Liste görünümü */
          <div className="bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-medium">Belgeler ({filteredDocs.length})</h2>
              <button className="flex items-center text-sm text-gray-500">
                Sırala: Son Güncellenen <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            </div>
            {filteredDocs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <AlertCircle className="mx-auto h-12 w-12" />
                <p className="mt-2 text-sm">Kayıt bulunamadı</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredDocs.map((d) => (
                  <li
                    key={d.id}
                    onClick={() => setSelected(d)}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center min-w-0 gap-4">
                      {statusIcon(d.status)}
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate text-gray-900">
                          {d.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          ID: {d.id} • Sahibi: {d.owner}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500"
                          style={{ width: `${(d.signatures / d.totalSignatories) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {d.signatures}/{d.totalSignatories}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      {/* █████ MODAL █████ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/60">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-scale-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-lg font-medium">Yeni Belge Oluştur</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Başlık</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Belge Türü</label>
                <select
                  value={newTypeId}
                  onChange={(e) => handleTypeSelect(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="" disabled>
                    Tür seçiniz
                  </option>
                  {DOCUMENT_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Belge Yükle</label>
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:border-indigo-500"
                >
                  <Upload className="h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-xs text-gray-500">
                    {newFile ? newFile.name : 'PDF, DOCX, JPG...'}
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="sr-only"
                    onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded text-sm text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={proceedChooseSigner}
                disabled={!newTypeId || !newFile}
                className="bg-indigo-600 px-4 py-2 rounded text-sm text-white disabled:opacity-50"
              >
                Sonraki: İmzacıları Seç
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
