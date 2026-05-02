import Skeleton from "./Skeleton";

const SkeletonCard = () => (
    <div className="skeleton-card" aria-hidden="true">
        <div className="skeleton-card__banner" />
        <div className="skeleton-card__content">
            <Skeleton height="0.75rem" width="75%" borderRadius="0.25rem" />
            <Skeleton height="0.625rem" width="55%" borderRadius="0.25rem" />
            <div className="skeleton-card__meta">
                <Skeleton height="0.75rem" width="2.5rem" borderRadius="0.25rem" />
                <Skeleton height="0.75rem" width="3.5rem" borderRadius="0.25rem" />
            </div>
        </div>
    </div>
);

export default SkeletonCard;
