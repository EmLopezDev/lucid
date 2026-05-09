import { useNavigate } from "react-router";
import Button from "../../components/Button/Button";

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <div className="not-found-page__glow" />
            <div className="not-found-page__content">
                <span className="not-found-page__code">404</span>
                <h1 className="not-found-page__heading">Page not found</h1>
                <p className="not-found-page__message">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Button buttonSize="large" onClick={() => navigate("/")}>
                    Back to Home
                </Button>
            </div>
        </div>
    );
}

export default NotFoundPage;
