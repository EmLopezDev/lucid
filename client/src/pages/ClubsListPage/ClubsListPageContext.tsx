import {
    useMemo,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import { type ClubType, type CreateClubType } from "@lucid/types";
import { ClubsListPageContext } from "./useClubsListPageContext";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { API_URL } from "@config/api";
import { filterByName } from "@lib/filter";
import { isFormDataValid, hasErrors, type FormRules } from "@lib/form";
import { objectCopy } from "@lib/generic";
import { toast } from "sonner";

type NewClubFormType = {
    clubName: string;
    visibility: "public" | "private";
    avatar: string;
    description: string;
};

type NewClubFormErrorsType = Record<keyof NewClubFormType, string>;

const CREATE_CLUB_EMPTY_FORM: NewClubFormType = {
    clubName: "",
    visibility: "public",
    avatar: "🎮",
    description: "",
};

const CREATE_CLUB_EMPTY_ERRORS: NewClubFormErrorsType = {
    clubName: "",
    visibility: "",
    avatar: "",
    description: "",
};

const CREATE_CLUB_RULES: FormRules<NewClubFormType> = {
    clubName: [[Boolean, "Club name is required"]],
    description: [[Boolean, "Description is required"]],
    visibility: [],
    avatar: [],
};

export type ClubsListPageContextType = {
    isLoading: boolean;
    error: string | null;
    filteredClubsData: ClubType[];
    createClubData: NewClubFormType;
    isCreateClubModalOpen: boolean;
    createClubErrors: NewClubFormErrorsType;
    onClubSearch: (event: ChangeEvent<HTMLInputElement>) => void;
    onClubNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onClubAvatarChange: (value: string) => void;
    onClubVisibilityChange: (value: string) => void;
    onClubDescriptionChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    onOpenCreateClubModal: () => void;
    onCloseCreateClubModal: () => void;
    onSubmitCreateClubForm: (event: SubmitEvent<HTMLFormElement>) => void;
    onJoinClub: (clubId: string) => Promise<boolean>;
    onLeaveClub: (clubId: string) => Promise<boolean>;
    refetch: () => void;
};

export const ClubsListPageProvider = ({ children }: { children: ReactNode }) => {
    const { currentUser } = useUserContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clubsData, setClubsData] = useState<ClubType[]>([]);
    const [filterData, setFilterData] = useState({ searchName: "" });
    const [createClubData, setCreateClubData] = useState<NewClubFormType>(
        objectCopy(CREATE_CLUB_EMPTY_FORM),
    );
    const [createClubErrors, setCreateClubErrors] = useState<NewClubFormErrorsType>(
        objectCopy(CREATE_CLUB_EMPTY_ERRORS),
    );
    const [isCreateClubModalOpen, setIsCreateClubModalOpen] = useState(false);
    const [fetchTrigger, setFetchTrigger] = useState(0);

    const filteredClubsData = useMemo(() => {
        return filterByName(clubsData, filterData.searchName);
    }, [clubsData, filterData]);

    const onClubSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setFilterData((prevState) => ({ ...prevState, searchName: event.target.value }));
    }, []);

    const onClubNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setCreateClubData((prevState) => ({
            ...prevState,
            clubName: event.target.value,
        }));
    }, []);

    const onClubVisibilityChange = useCallback((value: string) => {
        setCreateClubData((prevState) => ({
            ...prevState,
            visibility: value as "public" | "private",
        }));
    }, []);

    const onClubAvatarChange = useCallback((value: string) => {
        setCreateClubData((prevState) => ({ ...prevState, avatar: value }));
    }, []);

    const onClubDescriptionChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
        setCreateClubData((prevState) => ({
            ...prevState,
            description: event.target.value,
        }));
    }, []);

    const onCreateClub = useCallback(async (data: CreateClubType) => {
        try {
            const response = await fetch(`${API_URL}/clubs`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Failed to create club");
            const newClub: ClubType = await response.json();
            setClubsData((prevState) => [newClub, ...prevState]);
            toast.success(`Successfully created the club: ${newClub.name}.`);
            return true;
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
            toast.error("Unable to create club, try again.");
            return false;
        }
    }, []);

    const onJoinClub = useCallback(async (clubId: string) => {
        try {
            const response = await fetch(`${API_URL}/clubs/${clubId}/join`, {
                method: "PATCH",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to join club");
            const joinedClub: ClubType = await response.json();
            setClubsData((prevState) =>
                prevState.map((club) =>
                    club._id === clubId
                        ? {
                              ...club,
                              members: [
                                  ...club.members,
                                  { user_id: currentUser!._id, joined_at: new Date().toISOString() },
                              ],
                          }
                        : club,
                ),
            );
            toast.success(`Joined ${joinedClub.name} successfully.`);
            return true;
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
            toast.error("Unable to join club, try again.");
            return false;
        }
    }, [currentUser]);

    const onLeaveClub = useCallback(async (clubId: string) => {
        try {
            const response = await fetch(`${API_URL}/clubs/${clubId}/leave`, {
                method: "PATCH",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to leave club");
            const leftClub: ClubType = await response.json();
            setClubsData((prevState) =>
                prevState.map((club) => (club._id === clubId ? leftClub : club)),
            );
            toast.success(`Left club ${leftClub.name} successfully.`);
            return true;
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
            toast.error("Unable to leave club, try again.");
            return false;
        }
    }, []);

    const refetch = useCallback(() => setFetchTrigger((n) => n + 1), []);

    const onOpenCreateClubModal = useCallback(() => setIsCreateClubModalOpen(true), []);
    const onCloseCreateClubModal = useCallback(() => {
        setIsCreateClubModalOpen(false);
        setCreateClubData(objectCopy(CREATE_CLUB_EMPTY_FORM));
        setCreateClubErrors(objectCopy(CREATE_CLUB_EMPTY_ERRORS));
    }, []);

    const onSubmitCreateClubForm = useCallback(
        async (event: SubmitEvent<HTMLFormElement>) => {
            event.preventDefault();
            const validationErrors = isFormDataValid(
                createClubData,
                CREATE_CLUB_RULES,
                CREATE_CLUB_EMPTY_ERRORS,
            );
            if (hasErrors(validationErrors)) {
                setCreateClubErrors(validationErrors);
                return;
            }
            const success = await onCreateClub({
                name: createClubData.clubName,
                visibility: createClubData.visibility,
                description: createClubData.description,
                avatar_url: createClubData.avatar,
            });
            if (success) onCloseCreateClubModal();
        },
        [createClubData, onCreateClub, onCloseCreateClubModal],
    );

    useEffect(() => {
        const fetchGamingClubData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/clubs`, { credentials: "include" });
                if (!response.ok) throw new Error("Failed to fetch clubs");
                const data = await response.json();
                setClubsData(data);
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error(error instanceof Error ? error.message : error);
                }
                setError(error instanceof Error ? error.message : "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };
        fetchGamingClubData();
    }, [fetchTrigger]);

    const contextValue = useMemo(
        () => ({
            isLoading,
            error,
            isCreateClubModalOpen,
            filteredClubsData,
            createClubData,
            createClubErrors,
            onClubSearch,
            onClubNameChange,
            onClubVisibilityChange,
            onClubAvatarChange,
            onClubDescriptionChange,
            onOpenCreateClubModal,
            onCloseCreateClubModal,
            onSubmitCreateClubForm,
            onJoinClub,
            onLeaveClub,
            refetch,
        }),
        [
            isLoading,
            error,
            isCreateClubModalOpen,
            filteredClubsData,
            createClubData,
            createClubErrors,
            onClubSearch,
            onClubNameChange,
            onClubVisibilityChange,
            onClubAvatarChange,
            onClubDescriptionChange,
            onOpenCreateClubModal,
            onCloseCreateClubModal,
            onSubmitCreateClubForm,
            onJoinClub,
            onLeaveClub,
            refetch,
        ],
    );

    return (
        <ClubsListPageContext.Provider value={contextValue}>
            {children}
        </ClubsListPageContext.Provider>
    );
};
