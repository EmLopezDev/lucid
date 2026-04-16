function RegisterPage() {
    return (
        <div className="register-page">
            <form className="register-page__form">
                <label className="register-page__form-label">
                    First Name
                    <input
                        className="register-page__form-input"
                        type="text"
                        name="first_name"
                    />
                </label>
                <label className="register-page__form-label">
                    Last Name
                    <input
                        className="register-page__form-input"
                        type="text"
                        name="last_name"
                    />
                </label>
                <label className="register-page__form-label">
                    Email
                    <input
                        className="register-page__form-input"
                        type="email"
                        name="email"
                    />
                </label>
                <label className="register-page__form-label">
                    Password
                    <input
                        className="register-page__form-input"
                        type="password"
                        name="password"
                    />
                </label>
                <div className="register-page__form-buttons">
                    <button className="register-page__form-buttons-item">
                        Clear
                    </button>
                    <button
                        className="register-page__form-buttons-item"
                        type="submit"
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;
