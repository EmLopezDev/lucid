import { useCallback, useState } from "react";
import Button from "../../../../components/Button/Button";
import Form from "../../../../components/Form/Form";
import Input from "../../../../components/Input/Input";
import Modal from "../../../../components/Modal/Modal";
import { useProfileView } from "./useProfileView";

const ProfileView = () => {
    const [pendingDeleteAccount, setPendingDeleteAccount] = useState(false);
    const { formData, errors, formError, isSuccess, onChange, onSubmit, onReset, onDeleteProfile } =
        useProfileView();

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
            {isSuccess && <p className="profile-view__success">{isSuccess}</p>}
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
            <Modal
                isOpen={pendingDeleteAccount}
                title="Delete Account"
                onClose={onCancelDelete}
            >
                <div className="profile-view__delete-warning">
                    <p>Are you sure you want to delete your account?</p>
                    <div className="profile-view__delete-actions">
                        <Button
                            variant="secondary"
                            onClick={onCancelDelete}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={onConfirmDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProfileView;
