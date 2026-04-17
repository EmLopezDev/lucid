import { RegisterPageProvider } from "./RegisterPageContext";
import { useRegisterPageContext } from "./useRegisterPageContext";
import Input from "../../components/Input/Input";

const RegisterPageContent = () => {
    const {
        onSubmitForm,
        onFirstNameChange,
        onLastNameChange,
        onEmailChange,
        onPasswordChange,
        errors,
        showFormDataError,
    } = useRegisterPageContext();
    return (
        <div className="register-page">
            <form
                className="register-page__form"
                noValidate
                onSubmit={onSubmitForm}
            >
                <label className="register-page__form-label">
                    First Name
                    <Input
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
                    <Input
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
                    <Input
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
                    <Input
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
        <RegisterPageProvider>
            <RegisterPageContent />
        </RegisterPageProvider>
    );
};

export default RegisterPage;
