import Form from "../../../../components/Form/Form";
import Input from "../../../../components/Input/Input";
import { useProfileView } from "./useProfileView";

const ProfileView = () => {
    const { formData, errors, formError, isSuccess, onChange, onSubmit, onReset } =
        useProfileView();

    return (
        <div className="profile-view">
            <h2 className="profile-view__title">Profile</h2>
            {isSuccess && <p className="profile-view__success">Profile updated successfully.</p>}
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
        </div>
    );
};

export default ProfileView;
