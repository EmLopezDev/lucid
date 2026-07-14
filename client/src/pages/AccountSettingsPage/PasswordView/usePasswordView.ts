import { useState, useCallback, type ChangeEvent, type SubmitEvent } from "react";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { isFormDataValid, hasErrors, type FormRules } from "@lib/form";
import { objectCopy } from "@lib/generic";
import { API_URL } from "@config/api";
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
        mutationFn: async (data: PasswordFormType) => {
            let res: Response;
            try {
                res = await fetch(`${API_URL}/user/${currentUser!._id}/password`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
            } catch {
                throw new Error("Something went wrong");
            }
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message ?? "Something went wrong");
            }
        },
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
