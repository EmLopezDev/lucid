import { type ChangeEvent, type SubmitEvent } from "react";
import CheckBoxInput from "@components/CheckBoxInput";
import Textarea from "@components/Textarea";
import Form from "@components/Form";

type PostFormType = {
    postValue: string;
    postError: string;
    isSpoiler: boolean;
    primaryButtonText?: string;
    onPostChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onSpoilerChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
    onCancel: () => void;
};

const PostForm = ({
    postValue,
    postError,
    isSpoiler,
    primaryButtonText = "Add Post",
    onPostChange,
    onSpoilerChange,
    onSubmit,
    onCancel,
}: PostFormType) => {
    return (
        <Form
            onSubmit={onSubmit}
            onCancel={onCancel}
            primaryButtonText={primaryButtonText}
        >
            <Textarea
                label="Post"
                required
                maxCount={300}
                value={postValue}
                errorText={postError}
                onChange={onPostChange}
            />
            <CheckBoxInput
                label="Spoiler"
                checked={isSpoiler}
                onChange={onSpoilerChange}
            />
        </Form>
    );
};

export default PostForm;
