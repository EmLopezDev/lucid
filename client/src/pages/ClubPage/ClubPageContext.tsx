import {
    useState,
    useEffect,
    useMemo,
    useCallback,
    type ReactNode,
    type Dispatch,
    type SetStateAction,
} from "react";
import { useInfiniteQuery, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
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

type ClubPostsPage = { posts: ClubPostType[]; nextCursor: string | null };

const fetchClubPostsPage = async (clubId: string, cursor: string | null): Promise<ClubPostsPage> => {
    const url = cursor
        ? `${API_URL}/clubs/${clubId}/posts?before=${cursor}`
        : `${API_URL}/clubs/${clubId}/posts`;
    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) throw new Error("Failed to fetch posts");
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
    fetchMoreClubPosts: () => void;
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
    const [postsEnabled, setPostsEnabled] = useState(false);

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

    const postsQueryKey = useMemo(() => ["club-posts", clubId], [clubId]);

    const {
        data: clubPostsPages,
        isLoading: clubPostsLoading,
        isFetchingNextPage: clubPostsLoadingMore,
        hasNextPage: clubPostsHasMore,
        fetchNextPage,
        error: clubPostsError,
    } = useInfiniteQuery({
        queryKey: postsQueryKey,
        queryFn: ({ pageParam }) => fetchClubPostsPage(clubId, pageParam),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: postsEnabled,
    });

    const clubPostsData = useMemo(
        () => clubPostsPages?.pages.flatMap((page) => page.posts) ?? [],
        [clubPostsPages],
    );

    useEffect(() => {
        if (!clubPostsError) return;
        const message =
            clubPostsPages && clubPostsPages.pages.length > 0
                ? "Unable to load more posts, try again."
                : "Unable to load posts, try again.";
        toast.error(message);
    }, [clubPostsError, clubPostsPages]);

    // Rendering always flattens pages into one list, so page boundaries are just an
    // implementation detail here - after any edit we collapse everything into the first
    // page (preserving each page's nextCursor) rather than trying to re-slice the flat
    // list back into its original chunks.
    const setClubPostsData: Dispatch<SetStateAction<ClubPostType[]>> = useCallback(
        (update) => {
            queryClient.setQueryData<InfiniteData<ClubPostsPage>>(postsQueryKey, (old) => {
                if (!old) return old;
                const flatPosts = old.pages.flatMap((page) => page.posts);
                const nextFlatPosts = typeof update === "function" ? update(flatPosts) : update;
                const [firstPage, ...restPages] = old.pages;
                return {
                    ...old,
                    pages: [
                        { ...firstPage, posts: nextFlatPosts },
                        ...restPages.map((page) => ({ ...page, posts: [] })),
                    ],
                };
            });
        },
        [queryClient, postsQueryKey],
    );

    const fetchMoreClubPosts = useCallback(() => {
        fetchNextPage();
    }, [fetchNextPage]);

    const handlePostSwitchTab = useCallback(() => {
        onSwitchTab("posts");
        setPostsEnabled(true);
    }, [onSwitchTab]);

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
