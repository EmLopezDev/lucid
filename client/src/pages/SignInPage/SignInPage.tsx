import { SignInPageProvider } from "./SignInPageContext";

const SignInPageContent = () => {
    return <div>SignInPage</div>;
};

const SignInPage = () => {
    return (
        <SignInPageProvider>
            <SignInPageContent />
        </SignInPageProvider>
    );
};

export default SignInPage;
