import { useState, useCallback, type ChangeEvent, type SubmitEvent } from "react";
import { useClubPageContext } from "./useClubPageContext";
import { type ClubPostType, type CreateClubPostType, type UpdateClubPostType } from "@lucid/types";
import { objectCopy } from "@lib/generic";
import { toast } from "sonner";
import { API_URL } from "@config/api";

const EMPTY_POST: CreateClubPostType = {
    content: "",
    is_spoiler: false,
};

const useClubPosts = () => {
    const {
        clubId,
        clubPostsData,
        pendingPostId,
        pendingEditPost,
        setPendingPostId,
        setPendingEditPost,
        setClubPostsData,
        onOpenModal,
        onCloseModal,
    } = useClubPageContext();

    const [newClubPost, setNewClubPost] = useState<CreateClubPostType>(objectCopy(EMPTY_POST));
    const [postError, setPostError] = useState("");
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [isUpdatingPost, setIsUpdatingPost] = useState(false);
    const [isDeletingPost, setIsDeletingPost] = useState(false);

    const handleOpenPostModal = useCallback(() => {
        onOpenModal("createPost");
    }, [onOpenModal]);

    const handleCancelPost = useCallback(() => {
        onCloseModal();
        setNewClubPost(objectCopy(EMPTY_POST));
        setPostError("");
    }, [onCloseModal]);

    const handleOpenEditPostModal = useCallback(
        (postId: string) => {
            const post = clubPostsData.find((p) => p._id === postId);
            if (!post) return;
            setPendingEditPost({ content: post.content, is_spoiler: post.is_spoiler });
            setPendingPostId(postId);
            onOpenModal("editPost");
        },
        [clubPostsData, setPendingEditPost, setPendingPostId, onOpenModal],
    );

    const handleOpenDeletePostModal = useCallback(
        (postId: string) => {
            onOpenModal("deletePost");
            setPendingPostId(postId);
        },
        [onOpenModal, setPendingPostId],
    );

    const onClubPostContentChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setNewClubPost((prevState) => ({ ...prevState, content: e.target.value }));
        setPostError("");
    }, []);

    const onClubPostSpoilerChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setNewClubPost((prevState) => ({
            ...prevState,
            is_spoiler: e.target.checked,
        }));
    }, []);

    const onEditPostContentChange = useCallback(
        (e: ChangeEvent<HTMLTextAreaElement>) => {
            setPendingEditPost((prev) => ({ ...(prev ?? EMPTY_POST), content: e.target.value }));
            setPostError("");
        },
        [setPendingEditPost],
    );

    const onEditPostSpoilerChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setPendingEditPost((prev) => ({
                ...(prev ?? EMPTY_POST),
                is_spoiler: e.target.checked,
            }));
        },
        [setPendingEditPost],
    );

    const onCreatePost = useCallback(
        async (data: CreateClubPostType) => {
            try {
                setIsCreatingPost(true);
                const response = await fetch(`${API_URL}/clubs/${clubId}/posts`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!response.ok) throw new Error("Failed to add post");
                const newPost: ClubPostType = await response.json();
                setClubPostsData((prevState) => [newPost, ...prevState]);
                onCloseModal();
                setNewClubPost(objectCopy(EMPTY_POST));
                setPostError("");
                toast.success("Post was added.");
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error(error instanceof Error ? error.message : error);
                }
                toast.error("Unable to add post, try again.");
            } finally {
                setIsCreatingPost(false);
            }
        },
        [clubId, setClubPostsData, onCloseModal],
    );

    const onUpdatePost = useCallback(
        async (data: UpdateClubPostType) => {
            try {
                setIsUpdatingPost(true);
                const response = await fetch(`${API_URL}/clubs/${clubId}/posts/${pendingPostId}`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!response.ok) throw new Error("Failed to update post");
                const updatedPost: ClubPostType = await response.json();
                setClubPostsData((prevState) =>
                    prevState.map((p) => (p._id === pendingPostId ? updatedPost : p)),
                );
                onCloseModal();
                setPostError("");
                toast.success("Post was updated.");
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error(error instanceof Error ? error.message : error);
                }
                toast.error("Unable to update post, try again.");
            } finally {
                setIsUpdatingPost(false);
            }
        },
        [clubId, pendingPostId, setClubPostsData, onCloseModal],
    );

    const onDeletePost = useCallback(async () => {
        try {
            setIsDeletingPost(true);
            const response = await fetch(`${API_URL}/clubs/${clubId}/posts/${pendingPostId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to delete post");
            setClubPostsData((prevState) => prevState.filter((p) => p._id !== pendingPostId));
            onCloseModal();
            toast.success("Post was deleted.");
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
            toast.error("Unable to delete post, try again.");
        } finally {
            setIsDeletingPost(false);
        }
    }, [clubId, pendingPostId, setClubPostsData, onCloseModal]);

    const onSubmitPostForm = useCallback(
        async (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!newClubPost.content) {
                setPostError("Post content is required.");
                return;
            }
            onCreatePost(newClubPost);
        },
        [newClubPost, onCreatePost],
    );

    const onSubmitEditPostForm = useCallback(
        async (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!pendingEditPost?.content) {
                setPostError("Post content is required.");
                return;
            }
            onUpdatePost(pendingEditPost);
        },
        [pendingEditPost, onUpdatePost],
    );

    return {
        newClubPost,
        pendingEditPost,
        postError,
        isCreatingPost,
        isUpdatingPost,
        isDeletingPost,
        onDeletePost,
        onClubPostContentChange,
        onClubPostSpoilerChange,
        onEditPostContentChange,
        onEditPostSpoilerChange,
        onSubmitPostForm,
        onSubmitEditPostForm,
        handleOpenPostModal,
        handleOpenEditPostModal,
        handleCancelPost,
        handleOpenDeletePostModal,
    };
};

export default useClubPosts;
