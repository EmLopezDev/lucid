import { useState } from "react";
import { useClubPageContext } from "../hooks/useClubPageContext";
import Button from "@components/Button/Button";
import Icon from "@components/Icon";
import useClubMembers from "../hooks/useClubMembers";
import useClubPosts from "../hooks/useClubPosts";
import { useUserContext } from "@contexts/UserContext/useUserContext";

const formatPostDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

const ClubPagePostsTab = () => {
    const { clubData, isMember, isOwner } = useClubPageContext();
    const { onJoinClub } = useClubMembers();
    const { handleOpenPostModal } = useClubPosts();
    const { currentUser } = useUserContext();
    const [revealedPosts, setRevealedPosts] = useState<Set<string>>(new Set());

    if (!clubData) return null;

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
                    {clubData.posts.length > 0 ? (
                        <ul className="club-page__posts-list">
                            {clubData.posts.map((post) => (
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
                                        <span className="club-page__post-author">
                                            {resolveAuthor(post.author)}
                                        </span>
                                        <div className="club-page__post-meta-right">
                                            {post.is_spoiler && (
                                                <span className="club-page__badge club-page__badge--spoiler">
                                                    Spoiler
                                                </span>
                                            )}
                                            <span className="club-page__post-timestamp">
                                                {formatPostDate(post.created_at)}
                                            </span>
                                            {(isOwner || post.author === currentUser?._id) && (
                                                <Button
                                                    icon="trash"
                                                    variant="danger"
                                                    buttonSize="small"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className={`club-page__post-body-wrapper${post.is_spoiler && !revealedPosts.has(post._id) ? " club-page__post-body-wrapper--spoiler" : ""}`}
                                    >
                                        <p
                                            className={`club-page__post-body${post.is_spoiler && !revealedPosts.has(post._id) ? " club-page__post-body--blurred" : ""}`}
                                        >
                                            {post.content}
                                        </p>
                                        {post.is_spoiler && !revealedPosts.has(post._id) && (
                                            <div className="club-page__post-spoiler-overlay">
                                                <Icon
                                                    name="eye-off"
                                                    size="small"
                                                    color="gold"
                                                />
                                                <span className="club-page__post-spoiler-label">
                                                    Spoiler
                                                </span>
                                                <Button
                                                    variant="secondary"
                                                    buttonSize="small"
                                                    onClick={() =>
                                                        setRevealedPosts(
                                                            (prev) => new Set([...prev, post._id]),
                                                        )
                                                    }
                                                >
                                                    Reveal post
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
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
