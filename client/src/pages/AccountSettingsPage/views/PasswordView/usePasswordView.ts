import { useState, useCallback, type ChangeEvent, type SubmitEvent } from "react";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { isFormDataValid, hasErrors, type FormRules } from "@lib/form";
import { objectCopy } from "@lib/generic";
import { API_URL } from "@config/api";

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
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setIsSuccess(false);
    }, []);

    const onSubmit = useCallback(
        async (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            const validationErrors = isFormDataValid(formData, PASSWORD_RULES, EMPTY_FORM);
            if (hasErrors(validationErrors)) {
                setErrors(validationErrors);
                return;
            }
            setIsSubmitting(true);
            setFormError("");
            try {
                const res = await fetch(`${API_URL}/user/${currentUser!._id}/password`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                if (res.ok) {
                    setFormData(objectCopy(EMPTY_FORM));
                    setErrors(objectCopy(EMPTY_FORM));
                    setIsSuccess(true);
                } else {
                    const error = await res.json();
                    setFormError(error.message ?? "Something went wrong");
                }
            } catch {
                setFormError("Something went wrong");
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData, currentUser],
    );

    const onReset = useCallback(() => {
        setFormData(objectCopy(EMPTY_FORM));
        setErrors(objectCopy(EMPTY_FORM));
        setFormError("");
        setIsSuccess(false);
    }, []);

    return { formData, errors, formError, isSubmitting, isSuccess, onChange, onSubmit, onReset };
};
