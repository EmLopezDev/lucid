import { RegisterPageProvider } from "./RegisterPageContext";
import { useRegisterPageContext } from "./useRegisterPageContext";
import Input from "../../components/Input/Input";
import Form from "../../components/Form/Form";

const RegisterPageContent = () => {
    const {
        errors,
        onFirstNameChange,
        onLastNameChange,
        onEmailChange,
        onPasswordChange,
        showFormDataError,
        onSubmitForm,
        onResetForm,
    } = useRegisterPageContext();
    return (
        <Form
            onSubmit={onSubmitForm}
            errorText={showFormDataError()}
            onResetForm={onResetForm}
            primaryButtonText="Register"
            secondaryButtonText="Clear"
        >
            <Input
                type="text"
                name="first_name"
                label="First Name"
                errorText={errors.first_name}
                required
                onChange={onFirstNameChange}
            />
            <Input
                type="text"
                name="last_name"
                label="Last Name"
                errorText={errors.last_name}
                required
                onChange={onLastNameChange}
            />
            <Input
                type="email"
                name="email"
                label="Email"
                errorText={errors.email}
                required
                onChange={onEmailChange}
            />
            <Input
                type="password"
                name="password"
                label="Password"
                errorText={errors.password}
                required
                onChange={onPasswordChange}
            />
        </Form>
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
