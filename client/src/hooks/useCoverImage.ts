import { useState } from "react";

export const useCoverImage = (src: string | null) => {
    const [imgFailed, setImgFailed] = useState(false);
    const hasImage = !!src && !imgFailed;
    return {
        hasImage,
        handleError: () => setImgFailed(true),
        reset: () => setImgFailed(false),
    };
};
