import type { CSSProperties } from "react";

type SkeletonProps = {
    height: string;
    width?: string;
    borderRadius?: string;
    className?: string;
    style?: CSSProperties;
};

const Skeleton = ({ height, width, borderRadius, className, style }: SkeletonProps) => (
    <div
        className={`skeleton${className ? ` ${className}` : ""}`}
        aria-hidden="true"
        style={{ height, width, borderRadius, ...style }}
    />
);

export default Skeleton;
