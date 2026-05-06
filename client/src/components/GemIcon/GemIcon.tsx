type GemIconProps = {
    size?: number;
};

const GemIcon = ({ size = 20 }: GemIconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width={size}
        height={size}
        aria-hidden="true"
    >
        <polygon points="12,5 3,14 14,14" fill="#5e56b8" />
        <polygon points="20,5 18,14 29,14" fill="#8880e0" />
        <polygon points="12,5 20,5 18,14 14,14" fill="#a89ee8" />
        <polygon points="3,14 14,14 16,28" fill="#3a3490" />
        <polygon points="18,14 29,14 16,28" fill="#6258c4" />
        <polygon points="14,14 18,14 16,22" fill="#d8d2fa" />
    </svg>
);

export default GemIcon;
