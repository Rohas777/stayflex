import { useRoutes } from "react-router-dom";

import ProfileOverview from "../pages/ProfileOverview";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ActivateCode from "../pages/ActivateCode";
import ErrorPage from "../pages/ErrorPage";

import Layout from "../themes";
import AdminLayout from "../themes/adminLayout";

import Users from "../pages/Users";
import CreateUser from "../pages/CreateUser";
import Servers from "../pages/Servers";
import Regions from "../pages/Regions";
import Cities from "../pages/Cities";
import PropertyTypes from "../pages/PropertyTypes";
import Amenities from "../pages/Amenities";
import Objects from "../pages/Objects";
import UserObjects from "../pages/UserObjects";
import ObjectsClient from "../pages/ObjectsClient";
import CreateObject from "../pages/CreateObject";
import UpdateObject from "../pages/UpdateObject";
import Clients from "../pages/Clients";
import Reservations from "../pages/Reservations";
import ClientReservations from "../pages/ClientReservations";
import Channels from "../pages/Channels";
import Widget from "../pages/Widget";
import Tariffs from "../pages/Tariffs";
import TariffsClient from "../pages/TariffsClient";
import Icon from "../pages/Icon";
import { useEffect } from "react";
import { useAppDispatch } from "@/stores/hooks";
import { fetchUserById } from "@/stores/reducers/users/actions";

function Router() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchUserById(import.meta.env.VITE_CURRENT_USER_ID));
    }, []);

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
                    path: "/profile/:id",
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
                    element: <Users />,
                },
                {
                    path: "/admin/users",
                    element: <Users />,
                },
                {
                    path: "/admin/users/create",
                    element: <CreateUser />,
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
            path: "/register/activate",
            element: <ActivateCode />,
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
