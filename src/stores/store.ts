import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import darkModeReducer from "./darkModeSlice";
import colorSchemeReducer from "./colorSchemeSlice";
import menuReducer from "./menuSlice";
import themeReducer from "./themeSlice";
import userReducer from "./reducers/users/slice";
import regionReducer from "./reducers/regions/slice";
import cityReducer from "./reducers/cities/slice";
import propertyTypeReducer from "./reducers/property-types/slice";
import amenityReducer from "./reducers/amenities/slice";
import objectReducer from "./reducers/objects/slice";
import clientReducer from "./reducers/clients/slice";
import tariffReducer from "./reducers/tariffs/slice";
import reservationReducer from "./reducers/reservations/slice";
import authReducer from "./reducers/auth/slice";
import errorToastReducer from "./errorToastSlice";
import preferencesReducer from "./preferencesSlice";
import serverReducer from "./reducers/servers/slice";
import languageReducer from "./languageSlice";

export const store = configureStore({
    reducer: {
        darkMode: darkModeReducer,
        colorScheme: colorSchemeReducer,
        menu: menuReducer,
        theme: themeReducer,
        user: userReducer,
        region: regionReducer,
        city: cityReducer,
        propertyType: propertyTypeReducer,
        amenity: amenityReducer,
        object: objectReducer,
        client: clientReducer,
        tariff: tariffReducer,
        reservation: reservationReducer,
        auth: authReducer,
        error: errorToastReducer,
        preferences: preferencesReducer,
        server: serverReducer,
        language: languageReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
