// src/pages/chooseSigner/chooseSigner.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  X,
  Users,
  AlertCircle,
  GripVertical,
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getDocumentTypeById } from '../../constants/documentsTypes';
import { sendDocument } from '../services/starknet';
import './chooseSigner.css';
import { JSX } from 'react/jsx-runtime';

// -------------------- Tipler --------------------
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
};

type SelectedUser = {
  user: User;
  signOrder: number;
  deadline?: string;
};

type NavState = {
  documentTitle: string;
  documentTypeId: string;
  defaultSignFlow: string[];
  file: File;
};

// -------------------- Mock Kullanıcılar --------------------
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Ahmet Yılmaz', email: 'ahmet@corp.com', role: 'İK', department: 'İnsan Kaynakları' },
  { id: 'u2', name: 'Ayşe Demir', email: 'ayse@corp.com', role: 'Finans', department: 'Finans' },
  { id: 'u3', name: 'Mehmet Öz', email: 'mehmet@corp.com', role: 'Genel Müdür', department: 'Yönetim' },
  { id: 'u4', name: 'Zeynep Kaya', email: 'zeynep@corp.com', role: 'İK', department: 'İnsan Kaynakları' },
  { id: 'u5', name: 'Can Bilir', email: 'can@corp.com', role: 'Pazarlama', department: 'Pazarlama' },
  { id: 'u6', name: 'Fatma Şahin', email: 'fatma@corp.com', role: 'Yönetim', department: 'Yönetim' },
];

const findUserByRole = (role: string): User | undefined =>
  MOCK_USERS.find((u) => u.role.toLowerCase() === role.toLowerCase());

// -------------------- Bileşen --------------------
export default function ChooseSigner(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state ?? {}) as Partial<NavState>;

  const documentTitle = navState.documentTitle ?? 'Başlıksız Belge';
  const documentTypeId = navState.documentTypeId ?? '';
  const defaultSignFlow = navState.defaultSignFlow ?? [];
  const file = navState.file;

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<SelectedUser[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  // İlk açılışta default sign flow'u uygula
  useEffect(() => {
    if (defaultSignFlow.length && selected.length === 0) {
      const prefill = defaultSignFlow
        .map(findUserByRole)
        .filter(Boolean)
        .map((u, i) => ({ user: u as User, signOrder: i + 1 }));
      setSelected(prefill);
    }
  }, [defaultSignFlow, selected.length]);

  // Filtre
  const term = search.toLowerCase();
  const available = MOCK_USERS.filter(
    (u) =>
      (u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term)) &&
      !selected.some((s) => s.user.id === u.id),
  );

  // Kullanıcı ekle/çıkar
  const addUser = (u: User): void =>
    setSelected((prev) => [...prev, { user: u, signOrder: prev.length + 1 }]);
  const removeUser = (id: string): void =>
    setSelected((prev) => prev.filter((s) => s.user.id !== id).map((s, i) => ({ ...s, signOrder: i + 1 })));

  // Drag-drop sıralama
  const onDragStart = (idx: number): void => setDragIdx(idx);
  const onDragEnter = (idx: number): void => {
    if (dragIdx !== null) setOverIdx(idx);
  };
  const onDragEnd = (): void => {
    if (dragIdx === null || overIdx === null) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    const list = [...selected];
    const [moved] = list.splice(dragIdx, 1);
    list.splice(overIdx, 0, moved);
    setSelected(list.map((s, i) => ({ ...s, signOrder: i + 1 })));
    setDragIdx(null);
    setOverIdx(null);
  };

  // Zincire gönder (async)
  const confirm = async (): Promise<void> => {
    try {
      if (!file) throw new Error('Dosya bulunamadı');

      // *** IPFS yükleme kısmı burada olmalı
      const ipfsHash = 'Qm...'; // Şimdilik placeholder

      const tx = await sendDocument({
        title: documentTitle,
        docTypeId: documentTypeId,
        signers: selected.map((s) => s.user.id),
        ipfsHash,
      });

      toast.success('Belge zincire gönderildi. Tx hash: ' + ((tx as { transaction_hash?: string })?.transaction_hash ?? ''));
      navigate('/home');
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Gönderim hatası: ${err.message}`);
      } else {
        toast.error('Gönderim hatası.');
      }
    }
  };

  const docTypeLabel = getDocumentTypeById(documentTypeId)?.title ?? 'Tür seçilmedi';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sol panel */}
      <aside className="w-72 bg-white border-r shadow-sm">
        <div className="p-4 border-b">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-3"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Geri
          </button>
          <h1 className="font-semibold text-lg mb-1">İmzacı Seç</h1>
          <p className="text-xs text-gray-500">Belge: {documentTitle}</p>
          <p className="text-xs text-gray-500">Tür: {docTypeLabel}</p>
        </div>

        <div className="p-4 space-y-3">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kişi ara..."
              className="w-full pl-8 pr-3 py-2 border rounded text-sm"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
            {available.length === 0 ? (
              <div className="text-center text-sm text-gray-400 p-8">
                <AlertCircle className="mx-auto h-8 w-8 mb-2" /> Kişi bulunamadı
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {available.map((u) => (
                  <li key={u.id} className="py-2 flex justify-between items-center">
                    <span className="text-sm">{u.name}</span>
                    <button onClick={() => addUser(u)} className="text-indigo-600 text-xs">
                      Ekle
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>

      {/* Sağ panel */}
      <section className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h2 className="font-medium text-lg">İmza Sırası</h2>
          <button
            onClick={confirm}
            disabled={selected.length === 0}
            className="bg-indigo-600 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            İmzacıları Onayla
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {selected.length === 0 ? (
            <div className="text-center text-gray-400 mt-24">
              <Users className="mx-auto h-12 w-12 mb-3" /> Henüz imzacı eklenmedi.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {selected.map((s, idx) => (
                <li
                  key={s.user.id}
                  draggable
                  onDragStart={() => onDragStart(idx)}
                  onDragEnter={() => onDragEnter(idx)}
                  onDragEnd={onDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={`bg-white px-4 py-3 flex justify-between items-center ${
                    dragIdx === idx ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <GripVertical className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium mr-3 w-6 text-center text-indigo-600">{s.signOrder}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.user.name}</p>
                      <p className="text-xs text-gray-500">{s.user.role}</p>
                    </div>
                  </div>
                  <button onClick={() => removeUser(s.user.id)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>
      </section>
    </div>
  );
}

