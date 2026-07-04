import { useClubPageContext } from "./hooks/useClubPageContext";
import Modal from "@components/Modal";
import ConfirmModal from "@components/ConfirmModal";
import SetGameForm from "./SetGameForm";
import ChangeGameForm from "./ChangeGameForm";
import ClubForm from "./ClubForm";
import PostForm from "./PostForm";
import useClubGame from "./hooks/useClubGame";
import useClubMembers from "./hooks/useClubMembers";
import useClubSettings from "./hooks/useClubSettings";
import useClubPosts from "./hooks/useClubPosts";
import useClubInvite from "./hooks/useClubInvite";
import Button from "@components/Button/Button";

const ClubPageModals = () => {
    const { clubData, activeModal, onCloseModal } = useClubPageContext();
    const { onLeaveClub, onRemoveMember } = useClubMembers();
    const { onGameSet, onGameChange } = useClubGame();
    const {
        onClubDelete,
        editFormData,
        editFormErrors,
        onEditNameChange,
        onEditAvatarChange,
        onEditVisibilityChange,
        onEditDescriptionChange,
        onSubmitEditForm,
        handleCloseEditClubModal,
    } = useClubSettings();
    const {
        newClubPost,
        pendingEditPost,
        postError,
        onClubPostContentChange,
        onClubPostSpoilerChange,
        onEditPostContentChange,
        onEditPostSpoilerChange,
        onSubmitPostForm,
        onSubmitEditPostForm,
        onDeletePost,
        handleCancelPost,
    } = useClubPosts();

    const {
        inviteUrl,
        inviteExpiry,
        isConfirmingRegenerate,
        handleCopyInviteLink,
        handleRequestRegenerate,
        handleCancelRegenerate,
        handleConfirmRegenerate,
        handleCloseInviteModal,
    } = useClubInvite();

    if (!clubData) return null;

    return (
        <>
            {/* Edit Club */}
            <Modal
                isOpen={activeModal === "editClub"}
                title="Edit Club"
                onClose={handleCloseEditClubModal}
            >
                <ClubForm
                    nameValue={editFormData.name}
                    nameError={editFormErrors.name}
                    avatarValue={editFormData.avatar}
                    visibilityValue={editFormData.visibility}
                    descriptionValue={editFormData.description}
                    descriptionError={editFormErrors.description}
                    onNameChange={onEditNameChange}
                    onAvatarChange={onEditAvatarChange}
                    onVisibilityChange={onEditVisibilityChange}
                    onDescriptionChange={onEditDescriptionChange}
                    primaryButtonText="Save Changes"
                    onSubmit={onSubmitEditForm}
                    onCancel={handleCloseEditClubModal}
                />
            </Modal>

            {/* Delete Club */}
            <ConfirmModal
                isOpen={activeModal === "deleteClub"}
                title="Delete Club"
                message={
                    <>
                        This will permanently delete <strong>{clubData.name}</strong> and all its
                        data. This cannot be undone.
                    </>
                }
                confirmLabel="Delete Club"
                variant="danger"
                onConfirm={onClubDelete}
                onCancel={onCloseModal}
            />

            {/* Set Game */}
            <Modal
                isOpen={activeModal === "setGame"}
                title="Set Current Game"
                onClose={onCloseModal}
            >
                <SetGameForm
                    onSubmit={onGameSet}
                    onCancel={onCloseModal}
                />
            </Modal>

            {/* Change Game */}
            <Modal
                isOpen={activeModal === "changeGame"}
                title="Change Current Game"
                onClose={onCloseModal}
            >
                <ChangeGameForm
                    currentGameTitle={clubData.current_game?.title ?? ""}
                    onSubmit={onGameChange}
                    onCancel={onCloseModal}
                />
            </Modal>

            {/* Remove Member */}
            <ConfirmModal
                isOpen={activeModal === "removeClubMember"}
                title="Remove Member"
                message={`Remove this member from ${clubData.name}? They can rejoin if the club is public.`}
                confirmLabel="Remove"
                variant="danger"
                onConfirm={onRemoveMember}
                onCancel={onCloseModal}
            />

            {/* Leave Club */}
            <ConfirmModal
                isOpen={activeModal === "leaveClub"}
                title="Leave club"
                message={`Are you sure you want to leave ${clubData.name}? ${clubData.visibility === "private" ? "You will need a new invite link to rejoin." : "You can rejoin anytime."}`}
                confirmLabel="Leave club"
                variant="danger"
                onConfirm={onLeaveClub}
                onCancel={onCloseModal}
            />

            {/* Create Post */}
            <Modal
                isOpen={activeModal === "createPost"}
                title="Add Post"
                onClose={onCloseModal}
            >
                <PostForm
                    onPostChange={onClubPostContentChange}
                    onSpoilerChange={onClubPostSpoilerChange}
                    onSubmit={onSubmitPostForm}
                    onCancel={handleCancelPost}
                    postValue={newClubPost.content}
                    isSpoiler={newClubPost.is_spoiler}
                    postError={postError}
                />
            </Modal>

            <Modal
                isOpen={activeModal === "editPost"}
                title="Edit Post"
                onClose={onCloseModal}
            >
                <PostForm
                    onPostChange={onEditPostContentChange}
                    onSpoilerChange={onEditPostSpoilerChange}
                    onSubmit={onSubmitEditPostForm}
                    onCancel={handleCancelPost}
                    postValue={pendingEditPost?.content ?? ""}
                    isSpoiler={pendingEditPost?.is_spoiler ?? false}
                    postError={postError}
                    primaryButtonText="Save Changes"
                />
            </Modal>

            {/* Invite Code */}
            <Modal
                isOpen={activeModal === "inviteCode"}
                title="Share Invite"
                onClose={handleCloseInviteModal}
            >
                <div className="club-page__invite-modal">
                    <p className="club-page__invite-url">{inviteUrl}</p>
                    {inviteExpiry && (
                        <p className="club-page__invite-expiry">{inviteExpiry}</p>
                    )}
                    <div className="club-page__invite-actions">
                        <Button
                            variant="primary"
                            icon="copy"
                            iconPosition="left"
                            onClick={handleCopyInviteLink}
                        >
                            Copy Link
                        </Button>
                        <Button variant="outline" onClick={handleRequestRegenerate}>
                            Regenerate
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Regenerate Invite Code */}
            <ConfirmModal
                isOpen={isConfirmingRegenerate}
                title="Regenerate Invite Link"
                message="This will invalidate all previously shared invite links. Anyone with the old link will no longer be able to join."
                confirmLabel="Regenerate"
                variant="danger"
                onConfirm={handleConfirmRegenerate}
                onCancel={handleCancelRegenerate}
            />

            {/* Delete Post*/}
            <ConfirmModal
                isOpen={activeModal === "deletePost"}
                title="Delete Post"
                message="Are you sure you want to permanently delete this post? This cannot be undone."
                confirmLabel="Delete"
                variant="danger"
                onConfirm={onDeletePost}
                onCancel={onCloseModal}
            />
        </>
    );
};

export default ClubPageModals;
