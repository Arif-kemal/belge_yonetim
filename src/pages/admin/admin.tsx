import { useState } from "react";
import './admin.css';
import { Plus, ShieldCheck } from "lucide-react";

// Tip tanımları

type Employee = {
    id: string;
    name: string;
    email: string;
    department: string;
    walletAddress: string;
    nftAssigned: boolean;
};

type DocumentType = {
    id: string;
    title: string;
    description: string;
    preparers: string;
    approvers: string;
    signers: string;
};

const initialDocumentTypes: DocumentType[] = [
    {
        id: "1",
        title: "İşe Giriş Evrakları",
        description: "Çalışanın işe başlaması için gerekli evraklar",
        preparers: "İnsan Kaynakları",
        approvers: "-",
        signers: "Çalışan, İK"
    },
    {
        id: "2",
        title: "İş Sözleşmesi",
        description: "Çalışma şartlarının yazılı belgesi",
        preparers: "İK, Hukuk",
        approvers: "Yönetim",
        signers: "Çalışan, İK"
    },
    // ... Diğer belge türleri buraya aynı formatta eklenecek (kodu sade tutmak adına kısaltılmıştır)
];

function AdminPanel() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>(initialDocumentTypes);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDocTypeModal, setShowDocTypeModal] = useState(false);

    const addEmployee = (employee: Employee) => {
        setEmployees([...employees, employee]);
        setShowAddModal(false);
    };

    const assignNFT = (id: string) => {
        setEmployees(prev =>
            prev.map(emp =>
                emp.id === id ? { ...emp, nftAssigned: true } : emp
            )
        );
    };

    const addDocumentType = (docType: DocumentType) => {
        setDocumentTypes([...documentTypes, docType]);
        setShowDocTypeModal(false);
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Admin Panel</h1>
                <div className="button-group">
                    <button className="add-button" onClick={() => setShowAddModal(true)}>
                        <Plus className="icon" /> Yeni Çalışan
                    </button>
                    <button className="add-button" onClick={() => setShowDocTypeModal(true)}>
                        <Plus className="icon" /> Belge Türü
                    </button>
                </div>
            </header>

            <h2>Çalışanlar</h2>
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Ad Soyad</th>
                        <th>Email</th>
                        <th>Departman</th>
                        <th>Cüzdan</th>
                        <th>NFT</th>
                        <th>İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.name}</td>
                            <td>{emp.email}</td>
                            <td>{emp.department}</td>
                            <td>{emp.walletAddress}</td>
                            <td>
                                {emp.nftAssigned ? (
                                    <ShieldCheck className="icon green" />
                                ) : (
                                    <span className="text-gray">Atanmadı</span>
                                )}
                            </td>
                            <td>
                                {!emp.nftAssigned && (
                                    <button className="assign-btn" onClick={() => assignNFT(emp.id)}>
                                        NFT Ata
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Belge Türleri</h2>
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Tür</th>
                        <th>Açıklama</th>
                        <th>Hazırlayan</th>
                        <th>Onaylayan</th>
                        <th>İmzalayan</th>
                    </tr>
                </thead>
                <tbody>
                    {documentTypes.map(doc => (
                        <tr key={doc.id}>
                            <td>{doc.title}</td>
                            <td>{doc.description}</td>
                            <td>{doc.preparers}</td>
                            <td>{doc.approvers}</td>
                            <td>{doc.signers}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Yeni Çalışan Ekle</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const newEmployee: Employee = {
                                id: Date.now().toString(),
                                name: form.name,
                                email: form.email.value,
                                department: form.department.value,
                                walletAddress: form.wallet.value,
                                nftAssigned: false
                            };
                            addEmployee(newEmployee);
                        }}>
                            <input name="name" type="text" placeholder="Ad Soyad" required />
                            <input name="email" type="email" placeholder="Email" required />
                            <input name="department" type="text" placeholder="Departman" required />
                            <input name="wallet" type="text" placeholder="Cüzdan Adresi" required />
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowAddModal(false)} className="cancel-btn">İptal</button>
                                <button type="submit" className="submit-btn">Ekle</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDocTypeModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Yeni Belge Türü</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const newType: DocumentType = {
                                id: Date.now().toString(),
                                title: form.title,
                                description: form.description.value,
                                preparers: form.preparers.value,
                                approvers: form.approvers.value,
                                signers: form.signers.value
                            };
                            addDocumentType(newType);
                        }}>
                            <input name="title" type="text" placeholder="Belge Türü" required />
                            <input name="description" type="text" placeholder="Açıklama" required />
                            <input name="preparers" type="text" placeholder="Hazırlayan(lar)" required />
                            <input name="approvers" type="text" placeholder="Onaylayan(lar)" />
                            <input name="signers" type="text" placeholder="İmzalayan(lar)" required />
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowDocTypeModal(false)} className="cancel-btn">İptal</button>
                                <button type="submit" className="submit-btn">Ekle</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPanel;
