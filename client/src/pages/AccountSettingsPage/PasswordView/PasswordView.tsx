import Form from "@components/Form";
import Input from "@components/Input";
import { usePasswordView } from "./usePasswordView.js";

const PasswordView = () => {
    const { formData, errors, isSubmitting, onChange, onSubmit, onReset } = usePasswordView();

    return (
        <div className="password-view">
            <h2 className="password-view__title">Change Password</h2>
            <Form
                onSubmit={onSubmit}
                onCancel={onReset}
                primaryButtonText="Update Password"
                secondaryButtonText="Clear"
                isLoading={isSubmitting}
            >
                <Input
                    type="password"
                    name="current_password"
                    label="Current Password"
                    inputSize="large"
                    value={formData.current_password}
                    errorText={errors.current_password}
                    required
                    onChange={onChange}
                />
                <Input
                    type="password"
                    name="new_password"
                    label="New Password"
                    inputSize="large"
                    value={formData.new_password}
                    errorText={errors.new_password}
                    required
                    onChange={onChange}
                />
            </Form>
        </div>
    );
};

export default PasswordView;
