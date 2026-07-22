import {
    useState,
    useEffect,
    useMemo,
    useCallback,
    type ReactNode,
    type Dispatch,
    type SetStateAction,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type ClubDetailType, type ClubMemberType, type ClubPostType } from "@lucid/types";
import { API_URL } from "@config/api";
import { ClubPageContext } from "./hooks/useClubPageContext";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export type ClubTab = "overview" | "members" | "posts";

type ActiveModalType =
    | "setGame"
    | "changeGame"
    | "editClub"
    | "deleteClub"
    | "removeClubMember"
    | "leaveClub"
    | "createPost"
    | "editPost"
    | "deletePost"
    | "inviteCode"
    | null;

export type PendingEditPostType = { content: string; is_spoiler: boolean };

class ClubForbiddenError extends Error {}

const fetchClub = async (clubId: string): Promise<ClubDetailType> => {
    const response = await fetch(`${API_URL}/clubs/${clubId}`, { credentials: "include" });
    if (response.status === 403) throw new ClubForbiddenError();
    if (!response.ok) throw new Error("Failed to fetch club data");
    return response.json();
};

export type ClubPageContextType = {
    isLoading: boolean;
    error: string | null;
    clubId: string;
    clubData: ClubDetailType | null;
    isOwner: boolean;
    isMember: boolean;
    ownerMember: ClubMemberType | undefined;
    completedCount: number;
    activeTab: ClubTab;
    activeModal: ActiveModalType;
    pendingMemberId: string | null;
    pendingPostId: string | null;
    pendingEditPost: PendingEditPostType | null;
    clubPostsData: ClubPostType[];
    clubPostsLoading: boolean;
    clubPostsLoadingMore: boolean;
    clubPostsHasMore: boolean;
    setPendingMemberId: Dispatch<SetStateAction<string | null>>;
    setPendingPostId: Dispatch<SetStateAction<string | null>>;
    setPendingEditPost: Dispatch<SetStateAction<PendingEditPostType | null>>;
    setClubPostsData: Dispatch<SetStateAction<ClubPostType[]>>;
    fetchClubPosts: () => Promise<void>;
    fetchMoreClubPosts: () => Promise<void>;
    onOpenModal: (modal: Exclude<ActiveModalType, null>) => void;
    onCloseModal: () => void;
    setClubData: (data: ClubDetailType) => void;
    onSwitchTab: (tab: ClubTab) => void;
    handlePostSwitchTab: () => void;
};

export const ClubPageProvider = ({ children, clubId }: { children: ReactNode; clubId: string }) => {
    const [pendingMemberId, setPendingMemberId] = useState<string | null>(null);
    const [pendingPostId, setPendingPostId] = useState<string | null>(null);
    const [pendingEditPost, setPendingEditPost] = useState<PendingEditPostType | null>(null);
    const [activeTab, setActiveTab] = useState<ClubTab>("overview");
    const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
    const [clubPostsData, setClubPostsData] = useState<ClubPostType[]>([]);
    const [clubPostsLoading, setClubPostsLoading] = useState(false);
    const [clubPostsFetched, setClubPostsFetched] = useState(false);
    const [clubPostsCursor, setClubPostsCursor] = useState<string | null>(null);
    const [clubPostsHasMore, setClubPostsHasMore] = useState(false);
    const [clubPostsLoadingMore, setClubPostsLoadingMore] = useState(false);

    const { currentUser } = useUserContext();

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ["club", clubId], [clubId]);

    const {
        data: clubData = null,
        isLoading,
        error: queryError,
    } = useQuery({
        queryKey,
        queryFn: () => fetchClub(clubId),
        retry: false,
    });

    useEffect(() => {
        if (queryError instanceof ClubForbiddenError) navigate("/clubs");
    }, [queryError, navigate]);

    const error =
        queryError && !(queryError instanceof ClubForbiddenError)
            ? (queryError.message ?? "Something went wrong")
            : null;

    const setClubData = useCallback(
        (data: ClubDetailType) => {
            queryClient.setQueryData(queryKey, data);
        },
        [queryClient, queryKey],
    );

    const isOwner = currentUser?._id === clubData?.owner;
    const isMember = clubData?.members.some((m) => m._id === (currentUser?._id ?? "")) ?? false;
    const ownerMember = clubData?.members.find((m) => m._id === clubData.owner);
    const completedCount =
        clubData?.past_games.filter((g) => g.game_status === "completed").length ?? 0;

    const onSwitchTab = useCallback((tab: ClubTab) => setActiveTab(tab), []);

    const onOpenModal = useCallback((modal: Exclude<ActiveModalType, null>) => {
        setActiveModal(modal);
    }, []);
    const onCloseModal = useCallback(() => {
        setActiveModal(null);
        setPendingMemberId(null);
        setPendingPostId(null);
        setPendingEditPost(null);
    }, []);

    const fetchClubPosts = useCallback(async () => {
        if (clubPostsFetched) return;
        try {
            setClubPostsLoading(true);
            const response = await fetch(`${API_URL}/clubs/${clubId}/posts`, {
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch posts");
            const data: { posts: ClubPostType[]; nextCursor: string | null } =
                await response.json();
            setClubPostsData(data.posts);
            setClubPostsCursor(data.nextCursor);
            setClubPostsHasMore(data.nextCursor !== null);
            setClubPostsFetched(true);
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
            toast.error("Unable to load posts, try again.");
        } finally {
            setClubPostsLoading(false);
        }
    }, [clubId, clubPostsFetched]);

    const fetchMoreClubPosts = useCallback(async () => {
        if (!clubPostsCursor || clubPostsLoadingMore) return;
        try {
            setClubPostsLoadingMore(true);
            const response = await fetch(
                `${API_URL}/clubs/${clubId}/posts?before=${clubPostsCursor}`,
                { credentials: "include" },
            );
            if (!response.ok) throw new Error("Failed to fetch posts");
            const data: { posts: ClubPostType[]; nextCursor: string | null } =
                await response.json();
            setClubPostsData((prevState) => [...prevState, ...data.posts]);
            setClubPostsCursor(data.nextCursor);
            setClubPostsHasMore(data.nextCursor !== null);
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
            toast.error("Unable to load more posts, try again.");
        } finally {
            setClubPostsLoadingMore(false);
        }
    }, [clubId, clubPostsCursor, clubPostsLoadingMore]);

    const handlePostSwitchTab = useCallback(() => {
        onSwitchTab("posts");
        fetchClubPosts();
    }, [fetchClubPosts, onSwitchTab]);

    const contextValue = useMemo(
        () => ({
            clubId,
            isLoading,
            error,
            clubData,
            isOwner,
            isMember,
            ownerMember,
            completedCount,
            activeTab,
            activeModal,
            pendingMemberId,
            pendingPostId,
            pendingEditPost,
            clubPostsData,
            clubPostsLoading,
            clubPostsLoadingMore,
            clubPostsHasMore,
            fetchClubPosts,
            fetchMoreClubPosts,
            setClubPostsData,
            setPendingMemberId,
            setPendingPostId,
            setPendingEditPost,
            onOpenModal,
            onCloseModal,
            setClubData,
            onSwitchTab,
            handlePostSwitchTab,
        }),
        [
            clubId,
            isLoading,
            error,
            clubData,
            isOwner,
            isMember,
            ownerMember,
            completedCount,
            activeTab,
            activeModal,
            pendingMemberId,
            pendingPostId,
            pendingEditPost,
            clubPostsData,
            clubPostsLoading,
            clubPostsLoadingMore,
            clubPostsHasMore,
            fetchClubPosts,
            fetchMoreClubPosts,
            setClubPostsData,
            setPendingMemberId,
            setPendingPostId,
            setPendingEditPost,
            onOpenModal,
            onCloseModal,
            setClubData,
            onSwitchTab,
            handlePostSwitchTab,
        ],
    );

    return <ClubPageContext.Provider value={contextValue}>{children}</ClubPageContext.Provider>;
};
