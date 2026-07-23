import { useState, useCallback, type ChangeEvent, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useClubPageContext } from "./useClubPageContext";
import { type ClubDetailType, type UpdateClubType } from "@lucid/types";
import { API_URL } from "@config/api";
import { isFormDataValid, hasErrors, type FormRules } from "@lib/form";
import { objectCopy } from "@lib/generic";
import { toast } from "sonner";

type EditFormType = {
    name: string;
    avatar: string;
    visibility: "public" | "private";
    description: string;
};

type EditFormErrorsType = Record<keyof EditFormType, string>;

const EDIT_FORM_RULES: FormRules<EditFormType> = {
    name: [[Boolean, "Club name is required"]],
    description: [[Boolean, "Description is required"]],
    visibility: [],
    avatar: [],
};

const EMPTY_ERRORS: EditFormErrorsType = {
    name: "",
    avatar: "",
    visibility: "",
    description: "",
};

const useClubSettings = () => {
    const navigate = useNavigate();
    const { clubId, clubData, setClubData, onOpenModal, onCloseModal } = useClubPageContext();

    const [editFormData, setEditFormData] = useState<EditFormType>({
        name: clubData?.name ?? "",
        avatar: clubData?.avatar_url ?? "🎮",
        visibility: clubData?.visibility ?? "public",
        description: clubData?.description ?? "",
    });
    const [editFormErrors, setEditFormErrors] = useState<EditFormErrorsType>(
        objectCopy(EMPTY_ERRORS),
    );

    const handleOpenEditClubModal = () => {
        setEditFormData({
            name: clubData?.name ?? "",
            avatar: clubData?.avatar_url ?? "🎮",
            visibility: clubData?.visibility ?? "public",
            description: clubData?.description ?? "",
        });
        setEditFormErrors(objectCopy(EMPTY_ERRORS));
        onOpenModal("editClub");
    };

    const handleCloseEditClubModal = () => {
        setEditFormData({
            name: clubData?.name ?? "",
            avatar: clubData?.avatar_url ?? "🎮",
            visibility: clubData?.visibility ?? "public",
            description: clubData?.description ?? "",
        });
        setEditFormErrors(objectCopy(EMPTY_ERRORS));
        onCloseModal();
    };

    const handleOpenDeleteClubModal = () => onOpenModal("deleteClub");

    const onEditNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setEditFormData((prev) => ({ ...prev, name: e.target.value }));
    }, []);

    const onEditAvatarChange = useCallback((value: string) => {
        setEditFormData((prev) => ({ ...prev, avatar: value }));
    }, []);

    const onEditVisibilityChange = useCallback((value: string) => {
        setEditFormData((prev) => ({ ...prev, visibility: value as "public" | "private" }));
    }, []);

    const onEditDescriptionChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setEditFormData((prev) => ({ ...prev, description: e.target.value }));
    }, []);

    const editClubMutation = useMutation({
        mutationFn: async (data: UpdateClubType) => {
            const response = await fetch(`${API_URL}/clubs/${clubId}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Failed to update club");
            return (await response.json()) as ClubDetailType;
        },
        meta: {
            successMessage: "Club updated successfully.",
            errorMessage: "Unable to update club, try again.",
        },
        onSuccess: (updatedClub) => {
            onCloseModal();
            setClubData(updatedClub);
        },
    });

    const onSubmitEditForm = useCallback(
        (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            const validationErrors = isFormDataValid(editFormData, EDIT_FORM_RULES, EMPTY_ERRORS);
            if (hasErrors(validationErrors)) {
                setEditFormErrors(validationErrors);
                return;
            }
            editClubMutation.mutate({
                name: editFormData.name,
                avatar_url: editFormData.avatar,
                visibility: editFormData.visibility,
                description: editFormData.description,
            });
        },
        [editFormData, editClubMutation],
    );

    const deleteClubMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${API_URL}/clubs/${clubId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to delete club");
        },
        meta: { errorMessage: "Unable to delete club, try again." },
        onSuccess: () => {
            onCloseModal();
            toast.success(`Club ${clubData?.name} was deleted.`);
            navigate("/clubs");
        },
    });

    const onClubDelete = useCallback(() => {
        deleteClubMutation.mutate();
    }, [deleteClubMutation]);

    return {
        editFormData,
        editFormErrors,
        isSavingClub: editClubMutation.isPending,
        isDeletingClub: deleteClubMutation.isPending,
        onEditNameChange,
        onEditAvatarChange,
        onEditVisibilityChange,
        onEditDescriptionChange,
        onSubmitEditForm,
        onClubDelete,
        handleOpenEditClubModal,
        handleCloseEditClubModal,
        handleOpenDeleteClubModal,
    };
};

export default useClubSettings;
