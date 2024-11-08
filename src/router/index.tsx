import { useRoutes } from "react-router-dom";

import ProfileOverview from "../pages/ProfileOverview";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ActivateCode from "../pages/ActivateCode";
import ErrorPage from "../pages/ErrorPage";

import Layout from "../themes";

import Users from "../pages/Users";
import Admins from "../pages/Admins";
import Servers from "../pages/Servers";
import Regions from "../pages/Regions";
import Cities from "../pages/Cities";
import PropertyTypes from "../pages/PropertyTypes";
import Amenities from "../pages/Amenities";
import Objects from "../pages/Objects";
import Object from "../pages/Object";
import UserObjects from "../pages/UserObjects";
import ObjectsClient from "../pages/ObjectsUser";
import CreateObject from "../pages/CreateObject";
import UpdateObject from "../pages/UpdateObject";
import Clients from "../pages/Clients";
import Reservations from "../pages/Reservations";
import ClientReservations from "../pages/ClientReservations";
import Channels from "../pages/Channels";
import Widget from "../pages/Widget";
import Tariffs from "../pages/Tariffs";
import Logs from "../pages/Logs";
import TariffsClient from "../pages/TariffsClient";
import Icon from "../pages/Icon";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import { useEffect } from "react";
import { useAppSelector } from "@/stores/hooks";

function Router() {
    const { authorizedUser } = useAppSelector((state) => state.user);

    useEffect(() => {
        // if (!authorizedUser) {
        //     startLoader(setIsLoaderOpen);
        //     return
        // }
    }, [authorizedUser]);

    const routes = [
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "/",
                    element: <ObjectsClient />,
                },
                {
                    path: "objects",
                    element: <ObjectsClient />,
                },
                {
                    path: "objects/create",
                    element: <CreateObject />,
                },
                {
                    path: "objects/update/:id",
                    element: <UpdateObject />,
                },
                {
                    path: "tariffs",
                    element: <TariffsClient />,
                },
                {
                    path: "clients",
                    element: <Clients />,
                },
                {
                    path: "reservations",
                    element: <Reservations />,
                },
                {
                    path: "reservations/client/:id",
                    element: <ClientReservations />,
                },
                {
                    path: "channels",
                    element: <Channels />,
                },
                {
                    path: "widget",
                    element: <Widget />,
                },
                {
                    path: "/profile",
                    element: <ProfileOverview />,
                },
            ],
        },
        {
            path: "/admin/",
            element: <Layout admin />,
            children: [
                {
                    path: "/admin/",
                    element: <Admins />,
                },
                {
                    path: "/admin/users",
                    element: <Users />,
                },
                {
                    path: "/admin/profile",
                    element: <ProfileOverview />,
                },
                {
                    path: "/admin/users",
                    element: <Users />,
                },
                {
                    path: "/admin/servers",
                    element: <Servers />,
                },
                {
                    path: "/admin/regions",
                    element: <Regions />,
                },
                {
                    path: "/admin/cities",
                    element: <Cities />,
                },
                {
                    path: "/admin/property-types",
                    element: <PropertyTypes />,
                },
                {
                    path: "/admin/amenities",
                    element: <Amenities />,
                },
                {
                    path: "/admin/objects",
                    element: <Objects />,
                },
                {
                    path: "/admin/objects/user/:id",
                    element: <UserObjects />,
                },
                {
                    path: "/admin/objects/create",
                    element: <CreateObject />,
                },
                {
                    path: "/admin/objects/update/:id",
                    element: <UpdateObject />,
                },
                {
                    path: "/admin/tariffs",
                    element: <Tariffs />,
                },
                {
                    path: "/admin/clients",
                    element: <Clients />,
                },
                {
                    path: "/admin/reservations",
                    element: <Reservations />,
                },
                {
                    path: "/admin/icon",
                    element: <Icon />,
                },
                {
                    path: "/admin/reservations/client/:id",
                    element: <ClientReservations />,
                },
                {
                    path: "/admin/logs",
                    element: <Logs />,
                },
            ],
        },
        {
            path: "/",
            element: <Layout guest />,
            children: [
                {
                    path: "/object/:id",
                    element: <Object />,
                },
                {
                    path: "/terms",
                    element: <PrivacyPolicy />,
                },
            ],
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/login/auth",
            element: <ActivateCode />,
        },
        {
            path: "/register",
            element: <Register />,
        },
        {
            path: "/not-found",
            element: <ErrorPage />,
        },
        {
            path: "*",
            element: <ErrorPage />,
        },
    ];

    return useRoutes(routes);
}

export default Router;
