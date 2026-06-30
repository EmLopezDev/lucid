import { useMemo } from "react";
import { useClubsListPageContext } from "./useClubsListPageContext";
import { ClubsListPageProvider } from "./ClubsListPageContext";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { SkeletonCard } from "@components/Skeleton";
import Modal from "@components/Modal";
import Input from "@components/Input/Input";
import Button from "@components/Button/Button";
import ClubCard from "@components/ClubCard";
import ClubForm from "../ClubPage/ClubForm";

const ClubsListPageContent = () => {
    const {
        isLoading,
        error,
        filteredClubsData,
        isCreateClubModalOpen,
        createClubData,
        createClubErrors,
        onClubSearch,
        onClubNameChange,
        onClubVisibilityChange,
        onClubAvatarChange,
        onClubDescriptionChange,
        onOpenCreateClubModal,
        onCloseCreateClubModal,
        onSubmitCreateClubForm,
        onJoinClub,
        onLeaveClub,
        refetch,
    } = useClubsListPageContext();
    const { currentUser } = useUserContext();

    const { yourClubs, discoverClubs } = useMemo(() => {
        const userId = currentUser?._id ?? "";
        const yours = filteredClubsData
            .filter((c) => c.members.some((m) => m._id === userId))
            .sort((a, b) => {
                const aOwned = a.owner === userId ? 1 : 0;
                const bOwned = b.owner === userId ? 1 : 0;
                return bOwned - aOwned;
            });
        const discover = filteredClubsData.filter((c) => !c.members.some((m) => m._id === userId));
        return { yourClubs: yours, discoverClubs: discover };
    }, [filteredClubsData, currentUser]);

    const renderCards = (clubs: typeof filteredClubsData) =>
        clubs.map((club) => (
            <ClubCard
                key={club._id}
                club={club}
                currentUser={currentUser}
                onJoinClub={onJoinClub}
                onLeaveClub={onLeaveClub}
            />
        ));

    return (
        <section className="clubs-list-page">
            <div className="clubs-list-page__header">
                <h1 className="clubs-list-page__title">Clubs</h1>
                <span>
                    <Button
                        icon="plus"
                        iconPosition="left"
                        onClick={onOpenCreateClubModal}
                    >
                        Create Club
                    </Button>
                </span>
            </div>
            <>
                <div className="clubs-list-page__search">
                    <Input
                        placeholder="Search..."
                        onChange={onClubSearch}
                        hasErrorText={false}
                    />
                </div>
                {isLoading ? (
                    <div className="clubs-list-page__cards">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="clubs-list-page__empty-state">
                        <span className="clubs-list-page__empty-state__title">
                            Failed to load clubs
                        </span>
                        <p className="clubs-list-page__empty-state__sub">{error}</p>
                        <Button onClick={refetch}>Try again</Button>
                    </div>
                ) : !filteredClubsData.length ? (
                    <div className="clubs-list-page__empty-state">
                        <span className="clubs-list-page__empty-state__icon">🎮</span>
                        <span className="clubs-list-page__empty-state__title">No Clubs Yet</span>
                        <p className="clubs-list-page__empty-state__sub">
                            Be the first to create one
                        </p>
                        <Button
                            icon="plus"
                            iconPosition="left"
                            onClick={onOpenCreateClubModal}
                        >
                            Create Club
                        </Button>
                    </div>
                ) : (
                    <div className="clubs-list-page__sections">
                        {yourClubs.length > 0 && (
                            <div className="clubs-list-page__section">
                                <h2 className="clubs-list-page__section-heading">Your Clubs</h2>
                                <div className="clubs-list-page__cards">
                                    {renderCards(yourClubs)}
                                </div>
                            </div>
                        )}
                        {discoverClubs.length > 0 && (
                            <div className="clubs-list-page__section">
                                <h2 className="clubs-list-page__section-heading">Discover</h2>
                                <div className="clubs-list-page__cards">
                                    {renderCards(discoverClubs)}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </>
            <Modal
                isOpen={isCreateClubModalOpen}
                title="Create club"
                onClose={onCloseCreateClubModal}
            >
                <ClubForm
                    nameValue={createClubData.clubName}
                    nameError={createClubErrors.clubName}
                    avatarValue={createClubData.avatar}
                    visibilityValue={createClubData.visibility}
                    descriptionValue={createClubData.description}
                    descriptionError={createClubErrors.description}
                    onNameChange={onClubNameChange}
                    onAvatarChange={onClubAvatarChange}
                    onVisibilityChange={onClubVisibilityChange}
                    onDescriptionChange={onClubDescriptionChange}
                    primaryButtonText="Create"
                    onSubmit={onSubmitCreateClubForm}
                    onCancel={onCloseCreateClubModal}
                />
            </Modal>
        </section>
    );
};

const ClubsListPage = () => {
    return (
        <ClubsListPageProvider>
            <ClubsListPageContent />
        </ClubsListPageProvider>
    );
};

export default ClubsListPage;
