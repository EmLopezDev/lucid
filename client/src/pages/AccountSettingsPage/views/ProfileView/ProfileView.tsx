import { useCallback, useState } from "react";
import { useProfileView } from "./useProfileView";
import Button from "@components/Button/Button";
import Form from "@components/Form/Form";
import Input from "@components/Input/Input";
import ConfirmModal from "@components/ConfirmModal/ConfirmModal";
import Textarea from "@components/Textarea/Textarea";

const ProfileView = () => {
    const [pendingDeleteAccount, setPendingDeleteAccount] = useState(false);
    const {
        formData,
        errors,
        formError,
        onChange,
        onBioChange,
        onSubmit,
        onReset,
        onDeleteProfile,
    } = useProfileView();

    const onRequestDelete = useCallback(() => {
        setPendingDeleteAccount(true);
    }, []);

    const onConfirmDelete = useCallback(async () => {
        if (!pendingDeleteAccount) return;
        await onDeleteProfile();
        setPendingDeleteAccount(false);
    }, [pendingDeleteAccount, onDeleteProfile]);

    const onCancelDelete = useCallback(() => {
        setPendingDeleteAccount(false);
    }, []);

    return (
        <div className="profile-view">
            <h2 className="profile-view__title">Profile</h2>
            <Form
                onSubmit={onSubmit}
                onCancel={onReset}
                primaryButtonText="Save"
                secondaryButtonText="Reset"
                errorText={formError ? () => formError : undefined}
            >
                <Input
                    type="text"
                    name="first_name"
                    label="First Name"
                    inputSize="large"
                    value={formData.first_name}
                    errorText={errors.first_name}
                    required
                    onChange={onChange}
                />
                <Input
                    type="text"
                    name="last_name"
                    label="Last Name"
                    inputSize="large"
                    value={formData.last_name}
                    errorText={errors.last_name}
                    required
                    onChange={onChange}
                />
                <Input
                    type="email"
                    name="email"
                    label="Email"
                    inputSize="large"
                    value={formData.email}
                    errorText={errors.email}
                    required
                    onChange={onChange}
                />
                <Textarea
                    name="bio"
                    label="Bio"
                    textareaSize="large"
                    value={formData.bio}
                    rows={3}
                    maxCount={160}
                    onChange={onBioChange}
                />
            </Form>
            <span className="profile-view__delete-button">
                <Button
                    variant="danger"
                    buttonSize="large"
                    onClick={onRequestDelete}
                >
                    Delete Account
                </Button>
            </span>
            <ConfirmModal
                isOpen={pendingDeleteAccount}
                title="Delete Account"
                message="Are you sure you want to delete your account?"
                confirmLabel="Delete"
                onCancel={onCancelDelete}
                onConfirm={onConfirmDelete}
            />
        </div>
    );
};

export default ProfileView;
