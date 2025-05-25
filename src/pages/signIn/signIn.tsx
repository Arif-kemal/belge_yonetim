import './signin.css';

function SignIn() {
    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div className="signin-page">
            <div className="signin-card">
                <h2 className="signin-title">Giriş Yap</h2>
                <p className="signin-subtitle">Lütfen hesabınıza giriş yapın</p>

                <form onSubmit={handleSignIn}>
                    <label className="signin-label" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="signin-input"
                        placeholder="mail@ornek.com"
                        required
                    />

                    <label className="signin-label" htmlFor="password">Şifre</label>
                    <input
                        type="password"
                        id="password"
                        className="signin-input"
                        placeholder="••••••••"
                        required
                    />

                    <button type="submit" className="signin-btn">Giriş Yap</button>
                </form>

                <p className="signin-footer-text">
                    Hesabınız yok mu? Lütfen IT ekibinizle iletişime geçin.
                </p>
            </div>
        </div>
    );
}

export default SignIn;
