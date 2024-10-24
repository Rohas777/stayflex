import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAppSelector } from "@/stores/hooks";

type PrivateRouteType = "user" | "admin";

const PrivateRoute = ({
    children,
    type,
}: {
    children?: ReactNode;
    type: PrivateRouteType;
}) => {
    const { user } = useAppSelector((state) => state.auth);
    // const isAuthenticated = !!user;
    // const isAdmin = user?.is_admin;
    const isAuthenticated = true;
    const isAdmin = false;

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
        // return <Navigate to="/not-found" replace />;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
