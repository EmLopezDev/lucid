import { useClubPageContext } from "./useClubPageContext";
import Button from "@components/Button/Button";

const ClubPageMembersTab = () => {
    const { clubData, isOwner } = useClubPageContext();

    if (!clubData) return null;

    return (
        <div
            className="club-page__panel"
            role="tabpanel"
        >
            <ul className="club-page__member-list">
                {clubData.members.map((memberId) => (
                    <li
                        key={memberId}
                        className="club-page__member-item"
                    >
                        <div
                            className="club-page__member-avatar"
                            aria-hidden="true"
                        />
                        <div className="club-page__member-info">
                            <span className="club-page__member-name">{memberId}</span>
                            {memberId === clubData.owner && (
                                <span className="club-page__member-badge">Owner</span>
                            )}
                        </div>
                        {isOwner && memberId !== clubData.owner && (
                            <Button
                                variant="outline"
                                buttonSize="small"
                            >
                                Remove
                            </Button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClubPageMembersTab;
