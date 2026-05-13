import { useState, useCallback, type ChangeEvent, type SubmitEvent } from "react";
import { useUserContext } from "../../../../contexts/UserContext/useUserContext";
import { nameCheck, emailCheck } from "../../../../lib/string";
import { isFormDataValid, hasErrors, type FormRules } from "../../../../lib/form";
import { objectCopy } from "../../../../lib/generic";
import { API_URL } from "../../../../config/api";

type ProfileFormType = {
    first_name: string;
    last_name: string;
    email: string;
};

const EMPTY_ERRORS: ProfileFormType = {
    first_name: "",
    last_name: "",
    email: "",
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
};

export const useProfileView = () => {
    const { currentUser, setUser } = useUserContext();

    const [formData, setFormData] = useState<ProfileFormType>({
        first_name: currentUser?.first_name ?? "",
        last_name: currentUser?.last_name ?? "",
        email: currentUser?.email ?? "",
    });
    const [errors, setErrors] = useState<ProfileFormType>(objectCopy(EMPTY_ERRORS));
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
            const validationErrors = isFormDataValid(formData, PROFILE_RULES, EMPTY_ERRORS);
            if (hasErrors(validationErrors)) {
                setErrors(validationErrors);
                return;
            }
            setIsSubmitting(true);
            setFormError("");
            try {
                const res = await fetch(`${API_URL}/user/${currentUser!._id}`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                if (res.ok) {
                    const updated = await res.json();
                    setUser({ ...currentUser!, ...updated });
                    setErrors(objectCopy(EMPTY_ERRORS));
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
        [formData, currentUser, setUser],
    );

    const onReset = useCallback(() => {
        setFormData({
            first_name: currentUser?.first_name ?? "",
            last_name: currentUser?.last_name ?? "",
            email: currentUser?.email ?? "",
        });
        setErrors(objectCopy(EMPTY_ERRORS));
        setFormError("");
        setIsSuccess(false);
    }, [currentUser]);

    return { formData, errors, formError, isSubmitting, isSuccess, onChange, onSubmit, onReset };
};
