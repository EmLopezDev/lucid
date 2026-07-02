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
    const { clubId, pendingPostId, setPendingPostId, setClubData, onOpenModal, onCloseModal } =
        useClubPageContext();
    const [newClubPost, setNewClubPost] = useState<CreateClubPostType>(
        objectCopy(CREATE_EMPTY_POST),
    );

    const handleOpenPostModal = useCallback(() => {
        onOpenModal("createPost");
    }, [onOpenModal]);

    const handleCancelPost = useCallback(() => {
        onCloseModal();
        setNewClubPost(objectCopy(CREATE_EMPTY_POST));
    }, [onCloseModal]);

    const handleOpenDeletePostModal = useCallback(
        (postId: string) => {
            onOpenModal("deletePost");
            setPendingPostId(postId);
        },
        [onOpenModal, setPendingPostId],
    );

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
                toast.success("Post was added.");
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error(error instanceof Error ? error.message : error);
                }
                toast.error("Unable to add post, try again.");
            }
        },
        [clubId, setClubData, onCloseModal],
    );

    const onDeletePost = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/clubs/${clubId}/posts/${pendingPostId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to delete post");
            setClubData((prevState) => {
                if (!prevState) return prevState;
                return {
                    ...prevState,
                    posts: [...prevState.posts.filter((post) => post._id !== pendingPostId)],
                };
            });
            onCloseModal();
            toast.success("Post was deleted.");
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
            toast.error("Unable to delete post, try again.");
        }
    }, [clubId, pendingPostId, setClubData, onCloseModal]);

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
        handleOpenDeletePostModal,
    };
};

export default useClubPosts;
