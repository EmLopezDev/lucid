import SearchInput from "@components/SearchInput/SearchInput";
import Button from "@components/Button/Button";

const GamingClub = () => {
    return (
        <section className="gaming-club">
            <div className="gaming-club__header">
                <h1 className="gaming-club__title">Clubs</h1>
                <span>
                    <Button>Create Club</Button>
                </span>
            </div>
            <div className="gaming-club__search">
                <SearchInput<string>
                    query=""
                    results={[]}
                    isLoading={false}
                    onSelect={() => {}}
                    onReset={() => {}}
                    onQueryChange={() => {}}
                    renderResult={(result) => {
                        <div>{result}</div>;
                    }}
                    getKey={(result) => result}
                    getLabel={(result) => result}
                    placeholder="Search for a club..."
                />
            </div>
            <div className="gaming-club__cards">
                <article className="club-card">
                    <div>🎮</div>
                    <h3>Game Over</h3>
                    <span>🌐 Public</span>
                    <span>Elden Ring</span>
                    <span>15 members</span>
                    <button>Join</button>
                </article>
                <article className="club-card">
                    <div>🎮</div>
                    <h3>Game Over</h3>
                    <span>🌐 Public</span>
                    <span>Elden Ring</span>
                    <span>15 members</span>
                    <button>Join</button>
                </article>
                <article className="club-card">
                    <div>🎮</div>
                    <h3>Game Over</h3>
                    <span>🌐 Public</span>
                    <span>Elden Ring</span>
                    <span>15 members</span>
                    <button>Join</button>
                </article>
            </div>
        </section>
    );
};

export default GamingClub;
