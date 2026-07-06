import { useEffect, useState } from "react";
import { progressStore } from "./ProgressBarContext";

const ProgressBar = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    useEffect(() => {
        const unsubscribe = progressStore.subscribe(() => {
            if (progressStore.isRunning) {
                setIsCompleting(false);
                setIsRunning(true);
            } else {
                setIsCompleting(true);
                setTimeout(() => {
                    setIsRunning(false);
                    setIsCompleting(false);
                }, 400);
            }
        });
        return unsubscribe;
    }, []);

    if (!isRunning) return null;

    return <div className={`progress-bar ${isCompleting ? "progress-bar--completing" : ""}`} />;
};

export default ProgressBar;
