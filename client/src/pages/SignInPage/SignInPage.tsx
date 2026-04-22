import { SignInPageProvider } from "./SignInPageContext";
import Form from "../../components/Form/Form";
import Input from "../../components/Input/Input";
import { useSignInPageContext } from "./useSignInPageContext";

const SignInPageContent = () => {
    const {
        errors,
        onEmailChange,
        onPasswordChange,
        showFormDataError,
        onSubmitForm,
        onResetForm,
    } = useSignInPageContext();

    return (
        <Form
            onSubmit={onSubmitForm}
            errorText={showFormDataError()}
            onResetForm={onResetForm}
            primaryButtonText="Sign In"
            secondaryButtonText="Clear"
            buttonSize="large"
        >
            <Input
                label="Email"
                type="email"
                inputSize="large"
                onChange={onEmailChange}
                errorText={errors.email}
            />
            <Input
                label="Password"
                type="password"
                inputSize="large"
                onChange={onPasswordChange}
                errorText={errors.password}
            />
        </Form>
    );
};

const SignInPage = () => {
    return (
        <SignInPageProvider>
            <SignInPageContent />
        </SignInPageProvider>
    );
};

export default SignInPage;
