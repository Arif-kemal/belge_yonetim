// src/constants/documentTypes.ts
// -----------------------------------------------------------------------------
// Kurumsal belge yönetim sisteminde kullanılan TÜM varsayılan belge türleri ve
// bunların standart imzalama akışları burada tanımlanır. Böylece hem Homepage
// tarafındaki “Belge Oluştur” modalı hem de ChooseSigner sayfası merkezi bir
// kaynaktan beslenir. Anlaması basit!
// -----------------------------------------------------------------------------

// Tek bir imzacı nesnesi yerine sadece role string’i kullanıyoruz. İleride
// departman‑rol eşlemesi gerekiyorsa Signatory şemasına genişletilebilir.
export interface DocumentType {
    /** Kısa, benzersiz anahtar (slug) */
    id: string;
    /** UI’da görünen başlık */
    title: string;
    /** Kısa açıklama */
    description: string;
    /** Bu belgeyi hazırlama sorumluluğu hangi departmanda? */
    preparers: string[];
    /** Kurum içi onay mercii */
    approvers: string[];
    /** Islak / dijital imzayı atması beklenen kişiler */
    signers: string[];
    /** Önerilen imza sırası (role dizisi). ChooseSigner bunu ön‑doldurur. */
    defaultSignFlow: string[];
  }
  
  export const DOCUMENT_TYPES: DocumentType[] = [
    {
      id: 'onboarding',
      title: 'İşe Giriş Evrakları',
      description: 'Çalışanın işe başlaması için gerekli evraklar',
      preparers: ['İnsan Kaynakları'],
      approvers: [],
      signers: ['Çalışan', 'İK'],
      defaultSignFlow: ['İK', 'Çalışan'],
    },
    {
      id: 'employment_contract',
      title: 'İş Sözleşmesi',
      description: 'Çalışma şartlarının yazılı belgesi',
      preparers: ['İK', 'Hukuk'],
      approvers: ['Yönetim'],
      signers: ['Çalışan', 'İK'],
      defaultSignFlow: ['İK', 'Çalışan', 'Yönetim'],
    },
    {
      id: 'nda',
      title: 'Gizlilik Sözleşmesi (NDA)',
      description: 'Bilgi güvenliğini sağlama amaçlı sözleşme',
      preparers: ['İK', 'Hukuk'],
      approvers: ['Yönetim'],
      signers: ['Çalışan'],
      defaultSignFlow: ['Çalışan', 'Yönetim'],
    },
    {
      id: 'leave_request',
      title: 'İzin Talep Formu',
      description: 'Yıllık, mazeret, hastalık vb. izin talepleri',
      preparers: ['Çalışan'],
      approvers: ['Yöneticisi'],
      signers: ['Yöneticisi', 'İK'],
      defaultSignFlow: ['Çalışan', 'Yöneticisi', 'İK'],
    },
    {
      id: 'overtime_form',
      title: 'Fazla Mesai Formu',
      description: 'Ek çalışma saatlerinin kaydı',
      preparers: ['Çalışan'],
      approvers: ['Yöneticisi'],
      signers: ['Yöneticisi', 'İK'],
      defaultSignFlow: ['Çalışan', 'Yöneticisi', 'İK'],
    },
    {
      id: 'expense_claim',
      title: 'Masraf Talep Formu',
      description: 'Harcamaların geri ödemesi için talep',
      preparers: ['Çalışan'],
      approvers: ['Yöneticisi', 'Muhasebe'],
      signers: ['Çalışan', 'Muhasebe'],
      defaultSignFlow: ['Çalışan', 'Yöneticisi', 'Muhasebe'],
    },
    {
      id: 'purchase_request',
      title: 'Satın Alma Talep Formu',
      description: 'Ürün/hizmet alımı için talep',
      preparers: ['Birim Sorumlusu'],
      approvers: ['Satın Alma', 'Mali İşler'],
      signers: ['Birim', 'Satın Alma'],
      defaultSignFlow: ['Birim Sorumlusu', 'Satın Alma', 'Mali İşler'],
    },
    {
      id: 'purchase_order',
      title: 'Satın Alma Sipariş Formu (PO)',
      description: 'Onaylı satın alma emri',
      preparers: ['Satın Alma'],
      approvers: ['Mali İşler'],
      signers: ['Satın Alma', 'Yönetim'],
      defaultSignFlow: ['Satın Alma', 'Mali İşler', 'Yönetim'],
    },
    {
      id: 'invoice_approval',
      title: 'Fatura Onay Formu',
      description: 'Gelen faturaların ödemesi için onay',
      preparers: ['Muhasebe'],
      approvers: ['İlgili Departman'],
      signers: ['Muhasebe', 'Yönetim'],
      defaultSignFlow: ['Muhasebe', 'İlgili Departman', 'Yönetim'],
    },
    {
      id: 'handover_form',
      title: 'Zimmet Teslim Formu',
      description: 'Ekipman/malzeme teslimi',
      preparers: ['IT', 'Satın Alma'],
      approvers: [],
      signers: ['Çalışan', 'Teslim Eden'],
      defaultSignFlow: ['Teslim Eden', 'Çalışan'],
    },
  ];
  
  // Yardımcılar ---------------------------------------------------------------
  export const getDocumentTypeById = (id: string): DocumentType | undefined =>
    DOCUMENT_TYPES.find((t) => t.id === id);
  