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
        handleOnSearchClub,
        handleOnClubName,
        handleOnClubVisibility,
        handleOnClubAvatar,
        handleOnClubDescription,
        onOpenCreateClubModal,
        onCloseCreateClubModal,
        refetch,
        createClub,
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
                        onChange={handleOnSearchClub}
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
                    onSubmit={() => {}}
                    onCancel={onCloseCreateClubModal}
                    primaryButtonText="Create"
                >
                    <div className="create-club-form__identity">
                        <Input
                            label="Club name"
                            placeholder="Elite RPG"
                            onChange={handleOnClubName}
                            hasErrorText={false}
                            required
                        />
                        <EmojiPicker
                            label="Avatar"
                            value={createClub.avatar}
                            onChange={handleOnClubAvatar}
                        />
                    </div>
                    <RadioGroup
                        legend="Visibility"
                        name="visibility"
                        options={[
                            { value: "public", label: "public" },
                            { value: "private", label: "private" },
                        ]}
                        value={createClub.visibility}
                        onChange={handleOnClubVisibility}
                    />
                    <Textarea
                        label="Description"
                        onChange={handleOnClubDescription}
                        required
                        hasErrorText={false}
                        maxCount={300}
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
