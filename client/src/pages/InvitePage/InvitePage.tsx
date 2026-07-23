import { useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type ClubInvitePreviewType } from "@lucid/types";
import { API_URL } from "@config/api";
import Button from "@components/Button/Button";
import { toast } from "sonner";
import { useUserContext } from "@contexts/UserContext/useUserContext";

const fetchInvitePreview = async (clubId: string, code: string): Promise<ClubInvitePreviewType> => {
    let response: Response;
    try {
        response = await fetch(`${API_URL}/clubs/${clubId}/invite?code=${code}`, {
            credentials: "include",
        });
    } catch {
        throw new Error("Something went wrong.");
    }
    if (!response.ok) throw new Error("This invite link is invalid or has expired.");
    return response.json();
};

const InvitePage = () => {
    const { clubId } = useParams<{ clubId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get("code");
    const { isUserAuthenticated } = useUserContext();

    const {
        data: preview,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["invite-preview", clubId, code],
        queryFn: () => fetchInvitePreview(clubId!, code!),
        enabled: !!clubId && !!code,
        retry: false,
    });

    useEffect(() => {
        if (preview?.is_member && clubId) {
            navigate(`/clubs/${clubId}`, { replace: true });
        }
    }, [preview, clubId, navigate]);

    const joinMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${API_URL}/clubs/${clubId}/join`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ invite_code: code }),
            });
            if (!response.ok) throw new Error("Failed to join club");
        },
        meta: { errorMessage: "Unable to join club, try again." },
        onSuccess: () => {
            navigate(`/clubs/${clubId}`, { replace: true });
            toast.success(`You've joined ${preview?.name}!`);
        },
    });

    const onJoin = () => {
        joinMutation.mutate();
    };

    if (!clubId || !code) {
        return <div className="invite-page__error">Invalid invite link.</div>;
    }
    if (isLoading) return <div className="invite-page__loading">Loading...</div>;
    if (error) return <div className="invite-page__error">{error.message}</div>;
    if (!preview || preview.is_member) return null;

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
                        isLoading={joinMutation.isPending}
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
