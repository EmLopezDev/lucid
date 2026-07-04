import { type ChangeEvent, type SubmitEvent } from "react";
import Input from "@components/Input";
import RadioGroup from "@components/RadioGroup";
import Textarea from "@components/Textarea";
import EmojiPicker from "@components/EmojiPicker";
import Form from "@components/Form";

type ClubFormProps = {
    nameValue: string;
    nameError?: string;
    avatarValue: string;
    visibilityValue: "public" | "private";
    descriptionValue: string;
    descriptionError?: string;
    primaryButtonText: string;
    onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onAvatarChange: (value: string) => void;
    onVisibilityChange: (value: string) => void;
    onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
    onCancel: () => void;
};

const ClubForm = ({
    nameValue,
    nameError,
    avatarValue,
    visibilityValue,
    descriptionValue,
    descriptionError,
    onNameChange,
    onAvatarChange,
    onVisibilityChange,
    onDescriptionChange,
    primaryButtonText,
    onSubmit,
    onCancel,
}: ClubFormProps) => {
    return (
        <Form
            onSubmit={onSubmit}
            onCancel={onCancel}
            primaryButtonText={primaryButtonText}
        >
            <div className="club-form__identity">
                <Input
                    label="Club name"
                    placeholder="Elite RPG"
                    value={nameValue}
                    onChange={onNameChange}
                    errorText={nameError}
                    required
                />
                <EmojiPicker
                    label="Avatar"
                    value={avatarValue}
                    onChange={onAvatarChange}
                />
            </div>
            <RadioGroup
                legend="Visibility"
                name="visibility"
                options={[
                    { value: "public", label: "public" },
                    { value: "private", label: "private" },
                ]}
                value={visibilityValue}
                onChange={onVisibilityChange}
                required
            />
            <p className="club-form__visibility-hint">
                {visibilityValue === "private"
                    ? "Private clubs are invite-only and won't show up in Discover."
                    : "Public clubs are visible to everyone and show up in Discover for others to find and join."}
            </p>
            <Textarea
                label="Description"
                onChange={onDescriptionChange}
                required
                maxCount={300}
                value={descriptionValue}
                errorText={descriptionError}
            />
        </Form>
    );
};

export default ClubForm;
