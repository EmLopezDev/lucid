import { Suspense, type ReactNode } from "react";
import PageLoaderTrigger from "./PageLoaderTrigger";

type LazyRouteType = {
    fallback?: ReactNode;
    children: ReactNode;
};

const LazyRoute = ({ fallback, children }: LazyRouteType) => {
    return <Suspense fallback={fallback ?? <PageLoaderTrigger />}>{children}</Suspense>;
};

export default LazyRoute;
