import { useClubPageContext } from "./useClubPageContext";
import Button from "@components/Button/Button";
import Icon from "@components/Icon";

const ClubPagePostsTab = () => {
    const { isMember } = useClubPageContext();

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
                            buttonSize="small"
                            icon="plus"
                            iconPosition="left"
                        >
                            New Post
                        </Button>
                    </div>
                    <div className="club-page__posts-empty">
                        <p>No posts yet. Start the conversation.</p>
                    </div>
                </>
            ) : (
                <div className="club-page__posts-locked">
                    <Icon
                        name="eye-off"
                        size="large"
                        color="muted"
                    />
                    <p>Join this club to see and create posts.</p>
                    <Button
                        variant="primary"
                        buttonSize="small"
                    >
                        Join Club
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ClubPagePostsTab;
