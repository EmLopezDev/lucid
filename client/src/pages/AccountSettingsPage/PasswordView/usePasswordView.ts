import { useState, useCallback, type ChangeEvent, type SubmitEvent } from "react";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { isFormDataValid, hasErrors, type FormRules } from "@lib/form";
import { objectCopy } from "@lib/generic";
import { apiFetch } from "@lib/apiFetch";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

type PasswordFormType = {
    current_password: string;
    new_password: string;
};

const EMPTY_FORM: PasswordFormType = {
    current_password: "",
    new_password: "",
};

const PASSWORD_RULES: FormRules<PasswordFormType> = {
    current_password: [[Boolean, "Current password is required"]],
    new_password: [
        [Boolean, "New password is required"],
        [(v) => v.length >= 8, "Must be at least 8 characters"],
        [(v) => v.length <= 72, "Exceeded maximum characters"],
    ],
};

export const usePasswordView = () => {
    const { currentUser } = useUserContext();
    const [formData, setFormData] = useState<PasswordFormType>(objectCopy(EMPTY_FORM));
    const [errors, setErrors] = useState<PasswordFormType>(objectCopy(EMPTY_FORM));

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const updatePasswordMutation = useMutation({
        mutationFn: (data: PasswordFormType) =>
            apiFetch(`/user/${currentUser!._id}/password`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }),
        meta: { successMessage: "Password updated", skipErrorToast: true },
        onSuccess: () => {
            setFormData(objectCopy(EMPTY_FORM));
            setErrors(objectCopy(EMPTY_FORM));
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const onSubmit = useCallback(
        (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            const validationErrors = isFormDataValid(formData, PASSWORD_RULES, EMPTY_FORM);
            if (hasErrors(validationErrors)) {
                setErrors(validationErrors);
                return;
            }
            updatePasswordMutation.mutate(formData);
        },
        [formData, updatePasswordMutation],
    );

    const onReset = useCallback(() => {
        setFormData(objectCopy(EMPTY_FORM));
        setErrors(objectCopy(EMPTY_FORM));
    }, []);

    return {
        formData,
        errors,
        isSubmitting: updatePasswordMutation.isPending,
        onChange,
        onSubmit,
        onReset,
    };
};
