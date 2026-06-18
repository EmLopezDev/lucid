import { useGamingClubPageContext } from "./useGamingClubPageContext";
import { GamingClubPageProvider } from "./GamingClubPageContext";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { SkeletonCard } from "@components/Skeleton";
import Modal from "@components/Modal";
import Input from "@components/Input/Input";
import Button from "@components/Button/Button";
import ClubCard from "@components/ClubCard";
import Form from "@components/Form";
import Textarea from "@components/Textarea";
import RadioGroup from "@components/RadioGroup";
import EmojiPicker from "@components/EmojiPicker";

const GamingClubPageContent = () => {
    const {
        isLoading,
        error,
        filteredClubData,
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
        refetch,
    } = useGamingClubPageContext();
    const { currentUser } = useUserContext();

    return (
        <section className="gaming-club">
            <div className="gaming-club__header">
                <h1 className="gaming-club__title">Clubs</h1>
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
                <div className="gaming-club__search">
                    <Input
                        placeholder="Search..."
                        onChange={onClubSearch}
                        hasErrorText={false}
                    />
                </div>
                {isLoading ? (
                    <div className="gaming-club__cards">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="gaming-club__empty-state">
                        <span className="gaming-club__empty-state__title">
                            Failed to load clubs
                        </span>
                        <p className="gaming-club__empty-state__sub">{error}</p>
                        <Button onClick={refetch}>Try again</Button>
                    </div>
                ) : !filteredClubData.length ? (
                    <div className="gaming-club__empty-state">
                        <span className="gaming-club__empty-state__icon">🎮</span>
                        <span className="gaming-club__empty-state__title">No Clubs Yet</span>
                        <p className="gaming-club__empty-state__sub">Be the first to create one</p>
                        <Button
                            icon="plus"
                            iconPosition="left"
                            onClick={onOpenCreateClubModal}
                        >
                            Create Club
                        </Button>
                    </div>
                ) : (
                    <div className="gaming-club__cards">
                        {filteredClubData.map((club) => (
                            <ClubCard
                                key={club._id}
                                club={club}
                                currentUser={currentUser}
                                onJoinClub={onJoinClub}
                            />
                        ))}
                    </div>
                )}
            </>
            <Modal
                isOpen={isCreateClubModalOpen}
                title="Create club"
                onClose={onCloseCreateClubModal}
            >
                <Form
                    onSubmit={onSubmitCreateClubForm}
                    onCancel={onCloseCreateClubModal}
                    primaryButtonText="Create"
                >
                    <div className="create-club-form__identity">
                        <Input
                            label="Club name"
                            placeholder="Elite RPG"
                            onChange={onClubNameChange}
                            errorText={createClubErrors.clubName}
                            required
                        />
                        <EmojiPicker
                            label="Avatar"
                            value={createClubData.avatar}
                            onChange={onClubAvatarChange}
                        />
                    </div>
                    <RadioGroup
                        legend="Visibility"
                        name="visibility"
                        options={[
                            { value: "public", label: "public" },
                            { value: "private", label: "private" },
                        ]}
                        value={createClubData.visibility}
                        onChange={onClubVisibilityChange}
                    />
                    <Textarea
                        label="Description"
                        onChange={onClubDescriptionChange}
                        required
                        maxCount={300}
                        value={createClubData.description}
                        errorText={createClubErrors.description}
                    />
                </Form>
            </Modal>
        </section>
    );
};

const GamingClubPage = () => {
    return (
        <GamingClubPageProvider>
            <GamingClubPageContent />
        </GamingClubPageProvider>
    );
};

export default GamingClubPage;
