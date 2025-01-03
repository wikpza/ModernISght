import React, { createContext, useContext, useState } from 'react';
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { Mosaic } from "react-loading-indicators";

const LoadingContext = createContext({
    isLoading: false,
    startLoading: () => {},
    stopLoading: () => {}
});

export const LoadingOverlay = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = () => {
        setIsLoading(true);
    };

    const stopLoading = () => {
        setIsLoading(false);
    };

    return (
        <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
            <LoadingOverlayWrapper active={isLoading} spinner={<Mosaic color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]} />}>
                <div className={isLoading?'overflow-hidden max-h-dvh':''}>
                    {children}
                </div>
            </LoadingOverlayWrapper>
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    return useContext(LoadingContext);
};
