import { SignInPageProvider } from "./SignInPageContext";

//TODO: Convert to arrow function
function SignInPage() {
    return (
        <SignInPageProvider>
            <div>SignInPage</div>
        </SignInPageProvider>
    );
}

export default SignInPage;
