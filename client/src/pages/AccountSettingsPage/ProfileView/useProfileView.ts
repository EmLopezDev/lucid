import { useState, useCallback, type ChangeEvent, type SubmitEvent } from "react";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { nameCheck, emailCheck } from "@lib/string";
import { isFormDataValid, hasErrors, type FormRules } from "@lib/form";
import { objectCopy } from "@lib/generic";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@lib/apiFetch";
import { type UserType } from "@lucid/types";

type ProfileFormType = {
    first_name: string;
    last_name: string;
    email: string;
    bio: string;
};

const EMPTY_ERRORS: ProfileFormType = {
    first_name: "",
    last_name: "",
    email: "",
    bio: "",
};

const PROFILE_RULES: FormRules<ProfileFormType> = {
    first_name: [
        [Boolean, "First name is required"],
        [nameCheck, "First name should only be letters"],
    ],
    last_name: [
        [Boolean, "Last name is required"],
        [nameCheck, "Last name should only be letters"],
    ],
    email: [
        [Boolean, "Email is required"],
        [emailCheck, "Email format is invalid"],
    ],
    bio: [],
};

export const useProfileView = () => {
    const { currentUser, setUser } = useUserContext();

    const [formData, setFormData] = useState<ProfileFormType>({
        first_name: currentUser?.first_name ?? "",
        last_name: currentUser?.last_name ?? "",
        email: currentUser?.email ?? "",
        bio: currentUser?.bio ?? "",
    });
    const [errors, setErrors] = useState<ProfileFormType>(objectCopy(EMPTY_ERRORS));

    const navigate = useNavigate();

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const onBioChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setFormData((prev) => ({ ...prev, bio: value }));
    }, []);

    const updateProfileMutation = useMutation({
        mutationFn: (data: ProfileFormType) =>
            apiFetch<UserType>(`/user/${currentUser?._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }),
        // The server's error message is validation-specific (e.g. "Email
        // already in use"), so this opts out of the generic error toast and
        // fires its own with the real reason instead.
        meta: { successMessage: "Profile updated", skipErrorToast: true },
        onSuccess: (updated) => {
            setUser({ ...currentUser!, ...updated });
            setErrors(objectCopy(EMPTY_ERRORS));
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const onSubmit = useCallback(
        (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            const validationErrors = isFormDataValid(formData, PROFILE_RULES, EMPTY_ERRORS);
            if (hasErrors(validationErrors)) {
                setErrors(validationErrors);
                return;
            }
            updateProfileMutation.mutate(formData);
        },
        [formData, updateProfileMutation],
    );

    const onReset = useCallback(() => {
        setFormData({
            first_name: currentUser?.first_name ?? "",
            last_name: currentUser?.last_name ?? "",
            email: currentUser?.email ?? "",
            bio: currentUser?.bio ?? "",
        });
        setErrors(objectCopy(EMPTY_ERRORS));
    }, [currentUser]);

    const deleteAccountMutation = useMutation({
        mutationFn: () =>
            apiFetch(
                `/user/${currentUser?._id}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                },
                "Unable to delete account, try again.",
            ),
        // Some failures are permanent (e.g. protected demo accounts), so this
        // opts out of the generic error toast and shows the server's real
        // reason instead of implying a retry might work.
        meta: { successMessage: "Account deleted", skipErrorToast: true },
        onSuccess: () => {
            setUser(null);
            navigate("/");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const onDeleteProfile = useCallback(async () => {
        try {
            await deleteAccountMutation.mutateAsync();
            return true;
        } catch {
            return false;
        }
    }, [deleteAccountMutation]);

    return {
        formData,
        errors,
        isSubmitting: updateProfileMutation.isPending,
        isDeletingAccount: deleteAccountMutation.isPending,
        onChange,
        onBioChange,
        onSubmit,
        onReset,
        onDeleteProfile,
    };
};
