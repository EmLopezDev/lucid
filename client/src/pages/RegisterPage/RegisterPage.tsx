import { RegisterProvider } from "./RegisterPageContext";
import { useRegisterContext } from "./useRegisterPageContext";

const RegisterPageContent = () => {
    const {
        onSubmitForm,
        onFirstNameChange,
        onLastNameChange,
        onEmailChange,
        onPasswordChange,
        errors,
        showFormDataError,
    } = useRegisterContext();
    return (
        <div className="register-page">
            <form
                className="register-page__form"
                noValidate
                onSubmit={onSubmitForm}
            >
                <label className="register-page__form-label">
                    First Name
                    <input
                        className="register-page__form-input"
                        type="text"
                        name="first_name"
                        required
                        onChange={onFirstNameChange}
                    />
                    <span className="register-page__form-error">
                        {errors.first_name}
                    </span>
                </label>
                <label className="register-page__form-label">
                    Last Name
                    <input
                        className="register-page__form-input"
                        type="text"
                        name="last_name"
                        required
                        onChange={onLastNameChange}
                    />
                    <span className="register-page__form-error">
                        {errors.last_name}
                    </span>
                </label>
                <label className="register-page__form-label">
                    Email
                    <input
                        className="register-page__form-input"
                        type="email"
                        name="email"
                        required
                        onChange={onEmailChange}
                    />
                    <span className="register-page__form-error">
                        {errors.email}
                    </span>
                </label>
                <label className="register-page__form-label">
                    Password
                    <input
                        className="register-page__form-input"
                        type="password"
                        name="password"
                        required
                        onChange={onPasswordChange}
                    />
                    <span className="register-page__form-error">
                        {errors.password}
                    </span>
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
                <p className="horizontal-center">{showFormDataError()}</p>
            </form>
        </div>
    );
};

const RegisterPage = () => {
    return (
        <RegisterProvider>
            <RegisterPageContent />
        </RegisterProvider>
    );
};

export default RegisterPage;
