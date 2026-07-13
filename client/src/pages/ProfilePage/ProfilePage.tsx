import { useState } from "react";
import { SkeletonLoader, Skeleton } from "@components/Skeleton";
import { useUserProfile } from "./hooks/useUserProfile";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { NavLink } from "react-router";
import Icon from "@components/Icon";
import ProfilePageStatsTab from "./tabs/ProfilePageStatsTab";
import ProfilePagePlayingTab from "./tabs/ProfilePagePlayingTab";
import ProfilePageCompletedTab from "./tabs/ProfilePageCompletedTab";
import ProfilePageRecentTab from "./tabs/ProfilePageRecentTab";
import ProfilePageExpenditureTab from "./tabs/ProfilePageExpenditureTab";

type TabIdType = "stats" | "playing" | "completed" | "recent" | "expenditure";

const tabs: { id: TabIdType; label: string }[] = [
    { id: "stats", label: "Stats" },
    { id: "playing", label: "Currently Playing" },
    { id: "completed", label: "Completed" },
    { id: "recent", label: "Recently Added" },
    { id: "expenditure", label: "Expenditure" },
];

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState<TabIdType>("stats");
    const { currentUser } = useUserContext();
    const { profile, isLoading, error } = useUserProfile();

    if (isLoading) {
        return (
            <SkeletonLoader label="Loading profile">
                <div className="profile-page">
                    <div className="profile-page__header">
                        <div className="profile-page__header-top">
                            <Skeleton
                                height="4.5rem"
                                width="4.5rem"
                                borderRadius="50%"
                            />
                        </div>
                        <Skeleton
                            height="2rem"
                            width="14rem"
                            borderRadius="0.25rem"
                        />
                        <Skeleton
                            height="1rem"
                            width="10rem"
                            borderRadius="0.25rem"
                        />
                        <Skeleton
                            height="1rem"
                            width="8rem"
                            borderRadius="0.25rem"
                        />
                    </div>
                    <div className="profile-page__stats">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                height="5.5rem"
                                borderRadius="0.75rem"
                            />
                        ))}
                    </div>
                    <div className="profile-page__section">
                        <Skeleton
                            height="1.25rem"
                            width="10rem"
                            borderRadius="0.25rem"
                        />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                height="4rem"
                                borderRadius="0.5rem"
                            />
                        ))}
                    </div>
                </div>
            </SkeletonLoader>
        );
    }

    if (error) return <div className="profile-page__error">{error}</div>;
    if (!profile) return null;

    return (
        <div className="profile-page">
            <section className="profile-page__header">
                <div className="profile-page__header-top">
                    <div className="profile-page__avatar">
                        {currentUser?.first_name[0]}
                        {currentUser?.last_name[0]}
                    </div>
                    <NavLink
                        className="profile-page__settings-link"
                        to="/user/settings"
                        aria-label="Account settings"
                    >
                        <Icon
                            name="settings"
                            size="medium"
                        />
                    </NavLink>
                </div>
                <h1 className="profile-page__name">
                    {profile.first_name} {profile.last_name}
                </h1>
                {profile.bio && <p className="profile-page__bio">{profile.bio}</p>}
                <div className="profile-page__meta">
                    <span>{currentUser?.email}</span>
                    <span>
                        Member since{" "}
                        {new Date(profile.created_at).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                </div>
            </section>

            <div
                className="profile-page__tabs"
                role="tablist"
                aria-label="Profile sections"
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        className={`profile-page__tab${activeTab === tab.id ? " profile-page__tab--active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="profile-page__tab-panel">
                {activeTab === "stats" && <ProfilePageStatsTab />}

                {activeTab === "playing" && <ProfilePagePlayingTab />}

                {activeTab === "completed" && <ProfilePageCompletedTab />}

                {activeTab === "recent" && <ProfilePageRecentTab />}

                {activeTab === "expenditure" && <ProfilePageExpenditureTab />}
            </div>
        </div>
    );
};

export default ProfilePage;
