import Skeleton from "./Skeleton";
import SkeletonLoader from "./SkeletonLoader";

const AppSkeleton = () => (
    <SkeletonLoader label="Loading application">
        <div className="app-layout">
            <nav className="app-layout__nav">
                <Skeleton height="1.25rem" width="4rem" borderRadius="0.25rem" />
                <div className="app-layout__nav-auth">
                    <Skeleton height="1rem" width="3.5rem" borderRadius="0.25rem" />
                    <Skeleton height="1rem" width="3.5rem" borderRadius="0.25rem" />
                </div>
            </nav>
            <main className="app-layout__outlet" />
        </div>
    </SkeletonLoader>
);

export default AppSkeleton;
