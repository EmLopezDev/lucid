import {
    useMemo,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import { type GamingClubType, type PostGamingClubType } from "@lucid/types";
import { GamingClubPageContext } from "./useGamingClubPageContext";
import { API_URL } from "@config/api";
import { filterByName } from "@lib/filter";
import { isFormDataValid, hasErrors, type FormRules } from "@lib/form";
import { objectCopy } from "@lib/generic";

type CreateClubType = {
    clubName: string;
    visibility: "public" | "private";
    avatar: string;
    description: string;
};

type CreateClubErrorsType = Record<keyof CreateClubType, string>;

const CREATE_CLUB_EMPTY_FORM: CreateClubType = {
    clubName: "",
    visibility: "public",
    avatar: "🎮",
    description: "",
};

const CREATE_CLUB_EMPTY_ERRORS: CreateClubErrorsType = {
    clubName: "",
    visibility: "",
    avatar: "",
    description: "",
};

const CREATE_CLUB_RULES: FormRules<CreateClubType> = {
    clubName: [[Boolean, "Club name is required"]],
    description: [[Boolean, "Description is required"]],
    visibility: [],
    avatar: [],
};

export type GamingClubPageContextType = {
    isLoading: boolean;
    error: string | null;
    filteredClubData: GamingClubType[];
    createClubData: CreateClubType;
    isCreateClubModalOpen: boolean;
    createClubErrors: CreateClubErrorsType;
    onClubSearch: (event: ChangeEvent<HTMLInputElement>) => void;
    onClubNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onClubAvatarChange: (value: string) => void;
    onClubVisibilityChange: (value: string) => void;
    onClubDescriptionChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    onOpenCreateClubModal: () => void;
    onCloseCreateClubModal: () => void;
    onSubmitCreateClubForm: (event: SubmitEvent<HTMLFormElement>) => void;
    refetch: () => void;
};

export const GamingClubPageProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clubData, setClubData] = useState<GamingClubType[]>([]);
    const [filterData, setFilterData] = useState({ searchName: "" });
    const [createClubData, setCreateClubData] = useState<CreateClubType>(
        objectCopy(CREATE_CLUB_EMPTY_FORM),
    );
    const [createClubErrors, setCreateClubErrors] = useState<CreateClubErrorsType>(
        objectCopy(CREATE_CLUB_EMPTY_ERRORS),
    );
    const [isCreateClubModalOpen, setIsCreateClubModalOpen] = useState(false);
    const [fetchTrigger, setFetchTrigger] = useState(0);

    const filteredClubData = useMemo(() => {
        return filterByName(clubData, filterData.searchName);
    }, [clubData, filterData]);

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

    const createClub = useCallback(async (data: PostGamingClubType) => {
        try {
            const response = await fetch(`${API_URL}/clubs`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Failed to create club");
            const newClub: GamingClubType = await response.json();
            setClubData((prevState) => [newClub, ...prevState]);
            return true;
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
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
            const success = await createClub({
                name: createClubData.clubName,
                visibility: createClubData.visibility,
                description: createClubData.description,
                avatar_url: createClubData.avatar,
            });
            if (success) onCloseCreateClubModal();
        },
        [createClubData, createClub, onCloseCreateClubModal],
    );

    useEffect(() => {
        const fetchGamingClubData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/clubs`, { credentials: "include" });
                if (!response.ok) throw new Error("Failed to fetch clubs");
                const data = await response.json();
                setClubData(data);
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
            filteredClubData,
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
            refetch,
        }),
        [
            isLoading,
            error,
            isCreateClubModalOpen,
            filteredClubData,
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
            refetch,
        ],
    );

    return (
        <GamingClubPageContext.Provider value={contextValue}>
            {children}
        </GamingClubPageContext.Provider>
    );
};
