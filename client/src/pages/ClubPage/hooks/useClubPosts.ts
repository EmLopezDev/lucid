import { useState, useCallback, type ChangeEvent, type SubmitEvent } from "react";
import { useClubPageContext } from "./useClubPageContext";
import { type ClubPostType, type CreateClubPostType } from "@lucid/types";
import { objectCopy } from "@lib/generic";
import { toast } from "sonner";
import { API_URL } from "@config/api";

const CREATE_EMPTY_POST: CreateClubPostType = {
    content: "",
    is_spoiler: false,
};

const useClubPosts = () => {
    const { clubId, setClubData, onOpenModal, onCloseModal } = useClubPageContext();
    const [newClubPost, setNewClubPost] = useState<CreateClubPostType>(
        objectCopy(CREATE_EMPTY_POST),
    );

    const handleOpenPostModal = useCallback(() => {
        onOpenModal("post");
    }, [onOpenModal]);

    const handleCancelPost = useCallback(() => {
        onCloseModal();
        setNewClubPost(objectCopy(CREATE_EMPTY_POST));
    }, [onCloseModal]);

    const onClubPostContentChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setNewClubPost((prevState) => ({ ...prevState, content: e.target.value }));
    }, []);

    const onClubPostSpoilerChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setNewClubPost((prevState) => ({
            ...prevState,
            is_spoiler: e.target.checked,
        }));
    }, []);

    const onCreatePost = useCallback(
        async (data: CreateClubPostType) => {
            try {
                const response = await fetch(`${API_URL}/clubs/${clubId}/posts`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!response.ok) throw new Error("Failed to add post");
                const newPost: ClubPostType = await response.json();
                setClubData((prevState) => {
                    if (!prevState) return prevState;
                    return { ...prevState, posts: [newPost, ...prevState.posts] };
                });
                onCloseModal();
                setNewClubPost(objectCopy(CREATE_EMPTY_POST));
                toast.success("Post added.");
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error(error instanceof Error ? error.message : error);
                }
                toast.error("Unable to add post, try again.");
            }
        },
        [clubId, setClubData, onCloseModal],
    );

    const onDeletePost = useCallback(async () => {}, []);

    const onSubmitPostForm = useCallback(
        async (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!newClubPost.content) return;
            onCreatePost(newClubPost);
        },
        [newClubPost, onCreatePost],
    );

    return {
        newClubPost,
        onDeletePost,
        onClubPostContentChange,
        onClubPostSpoilerChange,
        onSubmitPostForm,
        handleOpenPostModal,
        handleCancelPost,
    };
};

export default useClubPosts;
