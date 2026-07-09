import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { type ClubInvitePreviewType } from "@lucid/types";
import { API_URL } from "@config/api";
import Button from "@components/Button/Button";
import { toast } from "sonner";
import { useUserContext } from "@contexts/UserContext/useUserContext";

const InvitePage = () => {
    const { clubId } = useParams<{ clubId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get("code");
    const { isUserAuthenticated } = useUserContext();

    const [preview, setPreview] = useState<ClubInvitePreviewType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPreview = async () => {
            if (!clubId || !code) {
                setError("Invalid invite link.");
                setIsLoading(false);
                return;
            }
            try {
                const response = await fetch(`${API_URL}/clubs/${clubId}/invite?code=${code}`, {
                    credentials: "include",
                });
                if (!response.ok) {
                    setError("This invite link is invalid or has expired.");
                    return;
                }
                const data: ClubInvitePreviewType = await response.json();
                if (data.is_member) {
                    navigate(`/clubs/${clubId}`, { replace: true });
                    return;
                }
                setPreview(data);
            } catch {
                setError("Something went wrong.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPreview();
    }, [clubId, code, navigate]);

    const onJoin = async () => {
        if (!clubId || !code) return;
        try {
            setIsJoining(true);
            const response = await fetch(`${API_URL}/clubs/${clubId}/join`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ invite_code: code }),
            });
            if (!response.ok) throw new Error();
            navigate(`/clubs/${clubId}`, { replace: true });
            toast.success(`You've joined ${preview?.name}!`);
        } catch {
            toast.error("Unable to join club, try again.");
        } finally {
            setIsJoining(false);
        }
    };

    if (isLoading) return <div className="invite-page__loading">Loading...</div>;
    if (error || !preview) return <div className="invite-page__error">{error}</div>;

    return (
        <div className="invite-page">
            <div className="invite-page__card">
                <div className="invite-page__avatar">
                    {preview.avatar_url ?? preview.name[0]}
                </div>
                <h1 className="invite-page__name">{preview.name}</h1>
                <p className="invite-page__meta">
                    {preview.member_count} {preview.member_count === 1 ? "member" : "members"} · Invited by {preview.owner.first_name} {preview.owner.last_name}
                </p>
                {isUserAuthenticated ? (
                    <Button
                        variant="primary"
                        onClick={onJoin}
                        isLoading={isJoining}
                    >
                        Join Club
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={() => {
                            const redirect = encodeURIComponent(
                                window.location.pathname + window.location.search,
                            );
                            navigate(`/signin?redirect=${redirect}`, {
                                state: {
                                    notice: "You need to sign in or create an account before accepting a club invite.",
                                },
                            });
                        }}
                    >
                        Sign in to Join
                    </Button>
                )}
            </div>
        </div>
    );
};

export default InvitePage;
