import { useRoutes } from "react-router-dom";
import Layout from "../themes";
import { useEffect } from "react";
import { useAppSelector } from "@/stores/hooks";

import ProfileOverview from "../pages/common/ProfileOverview";
import Login from "../pages/common/Login";
import Register from "../pages/common/Register";
import ActivateCode from "../pages/common/ActivateCode";
import UpdateObject from "../pages/common/UpdateObject";
import Clients from "../pages/common/Clients";
import Reservations from "../pages/common/Reservations";
import ClientReservations from "../pages/common/ClientReservations";
import ObjectReservations from "../pages/common/ObjectReservations";

import ObjectsClient from "../pages/user/Objects";
import CreateObject from "../pages/user/CreateObject";
import Channels from "../pages/user/Channels";
import Widget from "../pages/user/Widget";
import Scheduler from "../pages/user/Scheduler";
import TariffsClient from "../pages/user/Tariffs";

import Object from "../pages/public/Object";
import PrivacyPolicy from "../pages/public/PrivacyPolicy";
import PublicUserObjects from "../pages/public/UserObjects";
import ErrorPage from "../pages/public/ErrorPage";
import SuccessReservation from "../pages/public/SuccessReservation";

import Users from "../pages/admin/Users";
import Admins from "../pages/admin/Admins";
import Servers from "../pages/admin/Servers";
import Regions from "../pages/admin/Regions";
import Cities from "../pages/admin/Cities";
import PropertyTypes from "../pages/admin/PropertyTypes";
import Amenities from "../pages/admin/Amenities";
import Hashtags from "../pages/admin/Hashtags";
import Objects from "../pages/admin/Objects";
import UserObjects from "../pages/admin/UserObjects";
import Tariffs from "../pages/admin/Tariffs";
import Mails from "../pages/admin/Mails";
import Logs from "../pages/admin/LogsPage";
import Icon from "../pages/admin/Icon";

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
                    path: "/scheduler",
                    element: <Scheduler />,
                },

                {
                    path: "/",
                    element: <Scheduler />,
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
                    path: "reservations/object/:id",
                    element: <ObjectReservations />,
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
                    path: "/admin/hashtags",
                    element: <Hashtags />,
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
                    path: "/admin/reservations/object/:id",
                    element: <ObjectReservations />,
                },
                {
                    path: "/admin/logs",
                    element: <Logs />,
                },
                {
                    path: "/admin/mails",
                    element: <Mails />,
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
                    path: "/objects/:user_id",
                    element: <PublicUserObjects />,
                },
                {
                    path: "/terms",
                    element: <PrivacyPolicy />,
                },
                {
                    path: "/reservation-success",
                    element: <SuccessReservation />,
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
