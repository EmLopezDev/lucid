import { useParams } from "react-router";
import { ClubPageProvider } from "./ClubPageContext";
import { useClubPageContext } from "./hooks/useClubPageContext";
import ClubPageHeader from "./ClubPageHeader";
import ClubPageOverviewTab from "./tabs/ClubPageOverviewTab";
import ClubPageMembersTab from "./tabs/ClubPageMembersTab";
import ClubPagePostsTab from "./tabs/ClubPagePostsTab";
import ClubPageModals from "./ClubPageModals";

const ClubPageContent = () => {
    const { clubData, activeTab, clubPostsData, handlePostSwitchTab, onSwitchTab } =
        useClubPageContext();

    if (!clubData) return null;

    const postCount = clubPostsData.length > 0 ? clubPostsData.length : clubData.post_count;

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
                    onClick={() => onSwitchTab("overview")}
                >
                    Overview
                </button>
                <button
                    className={`club-page__tab${activeTab === "members" ? " club-page__tab--active" : ""}`}
                    role="tab"
                    onClick={() => onSwitchTab("members")}
                >
                    Members
                    <span className="club-page__tab-count">{clubData.members.length}</span>
                </button>
                <button
                    className={`club-page__tab${activeTab === "posts" ? " club-page__tab--active" : ""}`}
                    role="tab"
                    onClick={handlePostSwitchTab}
                >
                    Posts
                    <span className="club-page__tab-count">{postCount}</span>
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
