import React, {createContext} from 'react';
import * as ReactDOM from 'react-dom/client';
import "../src/fonts/fonts.css";
import './global.css';
import {BrowserRouter as Router} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import UserStore from "./store/UserStore.ts";
import AppRoutes from "./AppRoutes.tsx";



interface ContextType {
    user: UserStore;
}

export const Context = createContext<ContextType>(
    {
        user: new UserStore(),  // Устанавливаем UserStore как дефолтное значение
    })

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        }
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router>
            <QueryClientProvider client={queryClient}>
                <Context.Provider value={{
                    user: new UserStore()
                }}>
                    <AppRoutes />
                </Context.Provider>
            </QueryClientProvider>
        </Router>
    </React.StrictMode>,
);
