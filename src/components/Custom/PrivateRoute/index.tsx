import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useAppSelector } from "@/stores/hooks";
import Loader from "../Loader/Loader";
import { Status } from "@/stores/reducers/types";

type PrivateRouteType = "user" | "admin";

const PrivateRoute = ({
    children,
    type,
}: {
    children?: ReactNode;
    type: PrivateRouteType;
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const { authorizedUserStatus, authorizedUser } = useAppSelector(
        (state) => state.user
    );
    const isAuthenticated = !!authorizedUser;
    const isAdmin = !!authorizedUser ? authorizedUser?.is_admin : false;

    useEffect(() => {
        if (authorizedUserStatus !== Status.LOADING) {
            setIsLoading(false);
        }
    }, [authorizedUserStatus]);

    if (isLoading) {
        return <Loader className="w-full h-screen bg-primary" />;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (type === "user" && isAuthenticated && !isAdmin) {
        return children;
    }
    if (type === "user" && isAdmin) {
        return <Navigate to="/not-found" replace />;
    }
    if (type === "admin" && isAdmin) {
        return children;
    }
    if (type === "admin" && !isAdmin) {
        return <Navigate to="/not-found" replace />;
    }
};

export default PrivateRoute;
