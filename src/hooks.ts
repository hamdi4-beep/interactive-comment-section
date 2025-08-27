
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import React from "react";

export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export function useErrorBoundary() {
    const [error, setError] = React.useState<Error>()

    const handleError = (err: Error) =>
        setError(err)

    return {error, handleError}
}