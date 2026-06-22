import { useState } from "react";
import { useClubPageContext } from "./useClubPageContext";
import Button from "@components/Button/Button";

const ClubPageMembersTab = () => {
    const { clubData, isOwner } = useClubPageContext();
    const [search, setSearch] = useState("");

    if (!clubData) return null;

    const filtered = clubData.members.filter((id) =>
        id.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div
            className="club-page__panel"
            role="tabpanel"
        >
            <div className="club-page__members-header">
                <p className="club-page__members-count">
                    {clubData.members.length}{" "}
                    {clubData.members.length === 1 ? "member" : "members"}
                </p>
                <input
                    className="club-page__members-search"
                    placeholder="Search members…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search members"
                />
            </div>

            <ul className="club-page__member-list">
                {filtered.map((memberId) => (
                    <li
                        key={memberId}
                        className="club-page__member-item"
                    >
                        <div
                            className="club-page__member-avatar"
                            aria-hidden="true"
                        />
                        <div className="club-page__member-info">
                            <div className="club-page__member-name-row">
                                <span className="club-page__member-name">{memberId}</span>
                                {memberId === clubData.owner && (
                                    <span className="club-page__badge club-page__badge--owner">
                                        Owner
                                    </span>
                                )}
                            </div>
                        </div>
                        {isOwner && memberId !== clubData.owner && (
                            <Button
                                variant="danger"
                                buttonSize="small"
                            >
                                Remove
                            </Button>
                        )}
                    </li>
                ))}
                {filtered.length === 0 && (
                    <li className="club-page__members-empty">No members match &ldquo;{search}&rdquo;</li>
                )}
            </ul>
        </div>
    );
};

export default ClubPageMembersTab;
