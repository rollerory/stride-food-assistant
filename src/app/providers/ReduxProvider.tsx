"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { AuthProvider } from "@/context/AuthContext";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <Provider store={store}>{children}</Provider>
        </AuthProvider>
    );
}
