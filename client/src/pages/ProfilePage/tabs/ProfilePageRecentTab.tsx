import { useUserProfile } from "../hooks/useUserProfile";
import ProfileGameItem from "../ProfileGameItem";

const ProfilePageRecentTab = () => {
    const { profile } = useUserProfile();

    if (!profile) return null;
    return (
        <section className="profile-page__section">
            {profile.recentlyAdded.length === 0 ? (
                <p className="profile-page__empty">No games added yet.</p>
            ) : (
                <ul className="profile-page__game-list">
                    {profile.recentlyAdded.map((game) => (
                        <ProfileGameItem
                            key={game._id}
                            game={game}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
};

export default ProfilePageRecentTab;
