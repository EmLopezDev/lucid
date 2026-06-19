import { useState } from "react";
import { useParams } from "react-router";
import { ClubPageProvider } from "./ClubPageContext";
import { useClubPageContext } from "./useClubPageContext";
import ClubPageHeader from "./ClubPageHeader";
import ClubPageOverviewTab from "./ClubPageOverviewTab";
import ClubPageMembersTab from "./ClubPageMembersTab";
import ClubPagePostsTab from "./ClubPagePostsTab";
import ClubPageModals from "./ClubPageModals";

type Tab = "overview" | "members" | "posts";

const ClubPageContent = () => {
    const { clubData } = useClubPageContext();
    const [activeTab, setActiveTab] = useState<Tab>("overview");

    if (!clubData) return null;

    return (
        <div className="club-page">
            <ClubPageHeader />

            <div
                className="club-page__tabs"
                role="tablist"
            >
                <button
                    className={`club-page__tab${activeTab === "overview" ? " club-page__tab--active" : ""}`}
                    role="tab"
                    onClick={() => setActiveTab("overview")}
                >
                    Overview
                </button>
                <button
                    className={`club-page__tab${activeTab === "members" ? " club-page__tab--active" : ""}`}
                    role="tab"
                    onClick={() => setActiveTab("members")}
                >
                    Members
                    <span className="club-page__tab-count">{clubData.members.length}</span>
                </button>
                <button
                    className={`club-page__tab${activeTab === "posts" ? " club-page__tab--active" : ""}`}
                    role="tab"
                    onClick={() => setActiveTab("posts")}
                >
                    Posts
                </button>
            </div>

            {activeTab === "overview" && <ClubPageOverviewTab />}
            {activeTab === "members" && <ClubPageMembersTab />}
            {activeTab === "posts" && <ClubPagePostsTab />}

            <ClubPageModals />
        </div>
    );
};

const ClubPage = () => {
    const { clubId } = useParams();
    if (!clubId) return null;
    return (
        <ClubPageProvider clubId={clubId}>
            <ClubPageContent />
        </ClubPageProvider>
    );
};

export default ClubPage;
