import { useUserProfile } from "../hooks/useUserProfile";
import ProfileGameItem from "../ProfileGameItem";

const ProfilePagePlayingTab = () => {
    const { profile } = useUserProfile();
    if (!profile) return null;
    return (
        <section className="profile-page__section">
            {profile.currentlyPlaying.length === 0 ? (
                <p className="profile-page__empty">No games currently playing.</p>
            ) : (
                <ul className="profile-page__game-list">
                    {profile.currentlyPlaying.map((game) => (
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

export default ProfilePagePlayingTab;
