import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import darkModeReducer from "./darkModeSlice";
import colorSchemeReducer from "./colorSchemeSlice";
import menuReducer from "./menuSlice";
import themeReducer from "./themeSlice";
import userReducer from "./reducers/users/slice";
import regionReducer from "./reducers/regions/slice";
import cityReducer from "./reducers/cities/slice";
import propertyTypeReducer from "./reducers/property-types/slice";
import convenienceReducer from "./reducers/conveniences/slice";
import objectReducer from "./reducers/objects/slice";
import clientReducer from "./reducers/clients/slice";
import tariffReducer from "./reducers/tariffs/slice";

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
        convenience: convenienceReducer,
        object: objectReducer,
        client: clientReducer,
        tariff: tariffReducer,
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
