import { useState, useCallback, type ChangeEvent, type SubmitEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useClubPageContext } from "./useClubPageContext";
import { type ClubPostType, type CreateClubPostType, type UpdateClubPostType } from "@lucid/types";
import { objectCopy } from "@lib/generic";
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

    const createPostMutation = useMutation({
        mutationFn: async (data: CreateClubPostType) => {
            const response = await fetch(`${API_URL}/clubs/${clubId}/posts`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Failed to add post");
            return (await response.json()) as ClubPostType;
        },
        meta: {
            successMessage: "Post was added.",
            errorMessage: "Unable to add post, try again.",
        },
        onSuccess: (newPost) => {
            setClubPostsData((prevState) => [newPost, ...prevState]);
            onCloseModal();
            setNewClubPost(objectCopy(EMPTY_POST));
            setPostError("");
        },
    });

    const updatePostMutation = useMutation({
        mutationFn: async (data: UpdateClubPostType) => {
            const response = await fetch(`${API_URL}/clubs/${clubId}/posts/${pendingPostId}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Failed to update post");
            return (await response.json()) as ClubPostType;
        },
        meta: {
            successMessage: "Post was updated.",
            errorMessage: "Unable to update post, try again.",
        },
        onSuccess: (updatedPost) => {
            setClubPostsData((prevState) =>
                prevState.map((p) => (p._id === pendingPostId ? updatedPost : p)),
            );
            onCloseModal();
            setPostError("");
        },
    });

    const deletePostMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${API_URL}/clubs/${clubId}/posts/${pendingPostId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to delete post");
        },
        meta: {
            successMessage: "Post was deleted.",
            errorMessage: "Unable to delete post, try again.",
        },
        onSuccess: () => {
            setClubPostsData((prevState) => prevState.filter((p) => p._id !== pendingPostId));
            onCloseModal();
        },
    });

    const onDeletePost = useCallback(() => {
        deletePostMutation.mutate();
    }, [deletePostMutation]);

    const onSubmitPostForm = useCallback(
        (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!newClubPost.content) {
                setPostError("Post content is required.");
                return;
            }
            createPostMutation.mutate(newClubPost);
        },
        [newClubPost, createPostMutation],
    );

    const onSubmitEditPostForm = useCallback(
        (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!pendingEditPost?.content) {
                setPostError("Post content is required.");
                return;
            }
            updatePostMutation.mutate(pendingEditPost);
        },
        [pendingEditPost, updatePostMutation],
    );

    return {
        newClubPost,
        pendingEditPost,
        postError,
        isCreatingPost: createPostMutation.isPending,
        isUpdatingPost: updatePostMutation.isPending,
        isDeletingPost: deletePostMutation.isPending,
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
