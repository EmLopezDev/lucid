import { useUserProfile } from "../hooks/useUserProfile";
import ProfileGameItem from "../ProfileGameItem";

const ProfilePageCompletedTab = () => {
    const { profile } = useUserProfile();
    if (!profile) return null;
    return (
        <section className="profile-page__section">
            {profile.completed.length === 0 ? (
                <p className="profile-page__empty">No completed games yet.</p>
            ) : (
                <ul className="profile-page__game-list">
                    {profile.completed.map((game) => (
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

export default ProfilePageCompletedTab;
