import { useState } from "react";
import { useClubPageContext } from "./useClubPageContext";
import Button from "@components/Button/Button";
import Input from "@components/Input/Input";

const formatJoinDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });

const ClubPageMembersTab = () => {
    const { clubData, isOwner } = useClubPageContext();
    const [search, setSearch] = useState("");

    if (!clubData) return null;

    const filtered = clubData.members.filter((m) =>
        `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase()),
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
                <Input
                    placeholder="Search members…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search members"
                    hasErrorText={false}
                />
            </div>

            <ul className="club-page__member-list">
                {filtered.map((member) => (
                    <li
                        key={member._id}
                        className="club-page__member-item"
                    >
                        <div
                            className="club-page__member-avatar"
                            aria-hidden="true"
                        >
                            {member.first_name[0]}{member.last_name[0]}
                        </div>
                        <div className="club-page__member-info">
                            <div className="club-page__member-name-row">
                                <span className="club-page__member-name">
                                    {member.first_name} {member.last_name}
                                </span>
                                {member._id === clubData.owner && (
                                    <span className="club-page__badge club-page__badge--owner">
                                        Owner
                                    </span>
                                )}
                            </div>
                            <span className="club-page__member-joined">
                                Member since {formatJoinDate(member.joined_at)}
                            </span>
                        </div>
                        {isOwner && member._id !== clubData.owner && (
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
                    <li className="club-page__members-empty">
                        No members match &ldquo;{search}&rdquo;
                    </li>
                )}
            </ul>
        </div>
    );
};

export default ClubPageMembersTab;
