type SkeletonLoaderProps = {
    label?: string;
    children: React.ReactNode;
};

const SkeletonLoader = ({ label = "Loading content", children }: SkeletonLoaderProps) => (
    <div role="status" aria-label={label} aria-busy="true">
        <span className="sr-only">{label}</span>
        {children}
    </div>
);

export default SkeletonLoader;
