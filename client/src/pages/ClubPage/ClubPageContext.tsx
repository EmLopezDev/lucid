import {
    useState,
    useEffect,
    useMemo,
    useCallback,
    type ReactNode,
    type Dispatch,
    type SetStateAction,
} from "react";
import { type ClubDetailType, type ClubMemberType } from "@lucid/types";
import { API_URL } from "@config/api";
import { ClubPageContext } from "./hooks/useClubPageContext";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { toast } from "sonner";

export type ClubTab = "overview" | "members" | "posts";

type ActiveModalType =
    | "setGame"
    | "changeGame"
    | "editClub"
    | "deleteClub"
    | "deleteClubMember"
    | "leaveClub"
    | null;

export type ClubPageContextType = {
    isLoading: boolean;
    error: string | null;
    clubId: string;
    clubData: ClubDetailType | null;
    isOwner: boolean;
    isMember: boolean;
    ownerMember: ClubMemberType | undefined;
    activeTab: ClubTab;
    activeModal: ActiveModalType;
    onOpenModal: (modal: Exclude<ActiveModalType, null>) => void;
    onCloseModal: () => void;
    setClubData: Dispatch<SetStateAction<ClubDetailType | null>>;
    onSwitchTab: (tab: ClubTab) => void;
    onJoinClub: (clubId: string) => void;
    onLeaveClub: (clubId: string) => void;
};

export const ClubPageProvider = ({ children, clubId }: { children: ReactNode; clubId: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clubData, setClubData] = useState<ClubDetailType | null>(null);
    const [activeTab, setActiveTab] = useState<ClubTab>("overview");
    const [activeModal, setActiveModal] = useState<ActiveModalType>(null);

    const { currentUser } = useUserContext();

    const isOwner = currentUser?._id === clubData?.owner;
    const isMember = clubData?.members.some((m) => m._id === (currentUser?._id ?? "")) ?? false;
    const ownerMember = clubData?.members.find((m) => m._id === clubData.owner);

    const onSwitchTab = useCallback((tab: ClubTab) => setActiveTab(tab), []);

    const onOpenModal = useCallback((modal: Exclude<ActiveModalType, null>) => {
        setActiveModal(modal);
    }, []);
    const onCloseModal = useCallback(() => {
        setActiveModal(null);
    }, []);

    const onJoinClub = useCallback(async (clubId: string) => {
        try {
            const response = await fetch(`${API_URL}/clubs/${clubId}/join`, {
                method: "PATCH",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to join club");
            const joinedClub: ClubDetailType = await response.json();
            setClubData(joinedClub);
            toast.success(`Joined ${joinedClub.name} successfully.`);
            return true;
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
            toast.error("Unable to join club, try again.");
            return false;
        }
    }, []);

    const onLeaveClub = useCallback(
        async (clubId: string) => {
            try {
                const response = await fetch(`${API_URL}/clubs/${clubId}/leave`, {
                    method: "PATCH",
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Failed to leave club");
                const leftClub: ClubDetailType = await response.json();
                setClubData(leftClub);
                onCloseModal();
                toast.success(`Left club ${leftClub.name} successfully.`);
                return true;
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error(error instanceof Error ? error.message : error);
                }
                toast.error("Unable to leave club, try again.");
                return false;
            }
        },
        [onCloseModal],
    );

    useEffect(() => {
        const fetchClubData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/clubs/${clubId}`);
                if (!response.ok) throw new Error("Failed to fetch club data");
                const club: ClubDetailType = await response.json();
                setClubData(club);
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error(error instanceof Error ? error.message : error);
                }
                setError(error instanceof Error ? error.message : "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };
        fetchClubData();
    }, [clubId]);

    const contextValue = useMemo(
        () => ({
            isLoading,
            error,
            clubId,
            clubData,
            isOwner,
            isMember,
            ownerMember,
            activeTab,
            activeModal,
            onOpenModal,
            onCloseModal,
            setClubData,
            onSwitchTab,
            onJoinClub,
            onLeaveClub,
        }),
        [
            isLoading,
            error,
            clubId,
            clubData,
            isOwner,
            isMember,
            ownerMember,
            activeTab,
            activeModal,
            onOpenModal,
            onCloseModal,
            setClubData,
            onSwitchTab,
            onJoinClub,
            onLeaveClub,
        ],
    );

    return <ClubPageContext.Provider value={contextValue}>{children}</ClubPageContext.Provider>;
};
