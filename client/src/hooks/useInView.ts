import { useEffect, useState, type RefObject } from "react";

export const useInView = (ref: RefObject<HTMLElement | null>, threshold = 0.2) => {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [ref, threshold]);

    return isInView;
};
