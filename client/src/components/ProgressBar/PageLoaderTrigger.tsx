import { useEffect } from "react";
import { progressStore } from "./ProgressBarContext";

const PageLoaderTrigger = () => {
    useEffect(() => {
        progressStore.start();

        return () => {
            progressStore.complete();
        };
    }, []);

    return null;
};

export default PageLoaderTrigger;
