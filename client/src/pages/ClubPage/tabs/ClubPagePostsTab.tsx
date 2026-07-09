import { useState } from "react";
import { useClubPageContext } from "../hooks/useClubPageContext";
import Button from "@components/Button/Button";
import Icon from "@components/Icon";
import useClubMembers from "../hooks/useClubMembers";
import useClubPosts from "../hooks/useClubPosts";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { formatRelativeTime } from "@lib/date";
import { SkeletonLoader, Skeleton } from "@components/Skeleton";

const ClubPagePostsTab = () => {
    const {
        clubData,
        clubPostsData,
        clubPostsLoading,
        clubPostsHasMore,
        clubPostsLoadingMore,
        isMember,
        isOwner,
        fetchMoreClubPosts,
    } = useClubPageContext();
    const { onJoinClub } = useClubMembers();
    const { handleOpenPostModal, handleOpenEditPostModal, handleOpenDeletePostModal } =
        useClubPosts();
    const { currentUser } = useUserContext();
    const [revealedPosts, setRevealedPosts] = useState<Set<string>>(new Set());

    if (!clubData) return null;

    if (clubPostsLoading) {
        return (
            <SkeletonLoader label="Loading posts">
                <div className="club-page__posts-skeleton">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="club-page__post-item"
                        >
                            <div className="club-page__post-header">
                                <Skeleton
                                    height="36px"
                                    width="36px"
                                    borderRadius="50%"
                                />
                                <div className="club-page__post-author-group">
                                    <Skeleton
                                        height="12px"
                                        width="120px"
                                    />
                                    <Skeleton
                                        height="12px"
                                        width="60px"
                                    />
                                </div>
                            </div>
                            <Skeleton
                                height="14px"
                                width="100%"
                            />
                            <Skeleton
                                height="14px"
                                width="75%"
                            />
                        </div>
                    ))}
                </div>
            </SkeletonLoader>
        );
    }

    const resolveAuthor = (authorId: string) => {
        const member = clubData.members.find((m) => m._id === authorId);
        return member ? `${member.first_name} ${member.last_name}` : "Unknown";
    };

    const resolveInitials = (authorId: string) => {
        const member = clubData.members.find((m) => m._id === authorId);
        return member ? `${member.first_name[0]}${member.last_name[0]}` : "?";
    };

    return (
        <div
            className="club-page__panel"
            role="tabpanel"
        >
            {isMember ? (
                <>
                    <div className="club-page__posts-header">
                        <Button
                            variant="primary"
                            icon="plus"
                            iconPosition="left"
                            onClick={handleOpenPostModal}
                        >
                            New Post
                        </Button>
                    </div>
                    {clubPostsData.length > 0 ? (
                        <>
                            <ul className="club-page__posts-list">
                                {clubPostsData.map((post) => (
                                    <li
                                        key={post._id}
                                        className="club-page__post-item"
                                    >
                                        <div className="club-page__post-header">
                                            <div
                                                className="club-page__post-avatar"
                                                aria-hidden="true"
                                            >
                                                {resolveInitials(post.author)}
                                            </div>
                                            <div className="club-page__post-author-group">
                                                <span className="club-page__post-author">
                                                    {resolveAuthor(post.author)}
                                                </span>
                                                <span
                                                    className="club-page__post-dot"
                                                    aria-hidden="true"
                                                >
                                                    ·
                                                </span>
                                                <span className="club-page__post-timestamp">
                                                    {formatRelativeTime(post.created_at)}
                                                </span>
                                            </div>
                                            <div className="club-page__post-meta-right">
                                                {post.is_spoiler && (
                                                    <span className="club-page__badge club-page__badge--spoiler">
                                                        Spoiler
                                                    </span>
                                                )}
                                                {post.author === currentUser?._id && (
                                                    <Button
                                                        icon="edit"
                                                        variant="secondary"
                                                        buttonSize="small"
                                                        onClick={() =>
                                                            handleOpenEditPostModal(post._id)
                                                        }
                                                    />
                                                )}
                                                {(isOwner || post.author === currentUser?._id) && (
                                                    <Button
                                                        icon="trash"
                                                        variant="danger"
                                                        buttonSize="small"
                                                        onClick={() =>
                                                            handleOpenDeletePostModal(post._id)
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="club-page__post-body-wrapper">
                                            <p
                                                className={`club-page__post-body${post.is_spoiler && !revealedPosts.has(post._id) ? " club-page__post-body--blurred" : ""}`}
                                            >
                                                {post.content}
                                            </p>
                                            {post.is_spoiler && !revealedPosts.has(post._id) && (
                                                <div className="club-page__post-spoiler-overlay">
                                                    <button
                                                        className="club-page__post-spoiler-pill"
                                                        onClick={() =>
                                                            setRevealedPosts(
                                                                (prev) =>
                                                                    new Set([...prev, post._id]),
                                                            )
                                                        }
                                                    >
                                                        Spoiler — tap to reveal
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {clubPostsHasMore && (
                                <div className="club-page__posts-load-more">
                                    <Button
                                        variant="outline"
                                        buttonSize="medium"
                                        onClick={fetchMoreClubPosts}
                                        isLoading={clubPostsLoadingMore}
                                    >
                                        Load more
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="club-page__posts-placeholder">
                            <p>No posts yet. Start the conversation.</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="club-page__posts-placeholder">
                    <Icon
                        name="eye-off"
                        size="large"
                        color="muted"
                    />
                    <p>Join this club to see and create posts.</p>
                    <Button
                        variant="primary"
                        buttonSize="small"
                        onClick={onJoinClub}
                    >
                        Join Club
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ClubPagePostsTab;
