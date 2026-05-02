import Skeleton from "./Skeleton";

const SkeletonCardDetail = () => (
    <div className="skeleton-card-detail" aria-hidden="true">
        <div className="skeleton-card-detail__image" />
        <div className="skeleton-card-detail__content">
            <Skeleton height="1.125rem" width="80%" borderRadius="0.25rem" />
            <Skeleton height="0.75rem" width="50%" borderRadius="0.25rem" />
            <Skeleton height="1.5rem" width="4rem" borderRadius="1rem" />
            <div className="skeleton-card-detail__grid">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton-card-detail__stat">
                        <Skeleton height="0.5rem" width="60%" borderRadius="0.25rem" />
                        <Skeleton height="0.875rem" width="80%" borderRadius="0.25rem" />
                    </div>
                ))}
            </div>
            <Skeleton height="0.5rem" width="40%" borderRadius="0.25rem" />
            <Skeleton height="4rem" width="100%" borderRadius="0.5rem" />
        </div>
    </div>
);

export default SkeletonCardDetail;
