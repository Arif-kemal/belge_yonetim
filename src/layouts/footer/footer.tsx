import { Github, Twitter, Linkedin, Mail, FileCheck, ExternalLink } from 'lucide-react';
import './footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
        <div className="footer-container">
            <div className="footer-section">
            <h3 className="footer-title">ChainSign</h3>
            <p className="footer-description">
                Blockchain tabanlı, güvenli ve sürdürülebilir belge imzalama ve yönetim platformu.
            </p>
            <div className="footer-social">
                <a href="https://github.com/chainsign" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Github size={18} />
                </a>
                <a href="https://twitter.com/chainsign" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Twitter size={18} />
                </a>
                <a href="https://linkedin.com/company/chainsign" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Linkedin size={18} />
                </a>
                <a href="mailto:info@chainsign.com" className="social-icon">
                <Mail size={18} />
                </a>
            </div>
            </div>

            <div className="footer-section">
            <h4 className="footer-heading">Ürün</h4>
            <ul className="footer-links">
                <li><a href="/features">Özellikler</a></li>
                <li><a href="/pricing">Fiyatlandırma</a></li>
                <li><a href="/integrations">Entegrasyonlar</a></li>
                <li><a href="/security">Güvenlik</a></li>
            </ul>
            </div>

            <div className="footer-section">
            <h4 className="footer-heading">Kaynaklar</h4>
            <ul className="footer-links">
                <li><a href="/documentation">Dokümantasyon</a></li>
                <li><a href="/api">API</a></li>
                <li><a href="/tutorials">Eğitimler</a></li>
                <li><a href="/blog">Blog</a></li>
            </ul>
            </div>

            <div className="footer-section">
            <h4 className="footer-heading">Şirket</h4>
            <ul className="footer-links">
                <li><a href="/about">Hakkımızda</a></li>
                <li><a href="/customers">Müşterilerimiz</a></li>
                <li><a href="/careers">Kariyer</a></li>
                <li><a href="/contact">İletişim</a></li>
            </ul>
            </div>

            <div className="footer-section">
            <h4 className="footer-heading">Yasal</h4>
            <ul className="footer-links">
                <li><a href="/terms">Kullanım Şartları</a></li>
                <li><a href="/privacy">Gizlilik Politikası</a></li>
                <li><a href="/compliance">Uyumluluk</a></li>
                <li><a href="/gdpr">KVKK</a></li>
            </ul>
            </div>
        </div>

        <div className="footer-bottom">
            <div className="footer-bottom-container">
            <p className="copyright">
                &copy; {currentYear} ChainSign. Tüm hakları saklıdır.
            </p>
            <div className="footer-badges">
                <a href="/verification" className="badge">
                <FileCheck size={14} />
                <span>Blockchain Doğrulama</span>
                </a>
                <a href="https://starknet.io" target="_blank" rel="noopener noreferrer" className="badge">
                <span>StarkNet üzerinde çalışır</span>
                <ExternalLink size={12} />
                </a>
            </div>
            </div>
        </div>
        </footer>
    );
};

export default Footer;