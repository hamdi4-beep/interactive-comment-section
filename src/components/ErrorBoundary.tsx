import { useEffect } from "react"
import { useErrorBoundary } from "../hooks"

function ErrorBoundary({
    children,
    fallback
}: {
    children: React.ReactNode
    fallback?: React.ReactNode
}) {
    const {error, handleError} = useErrorBoundary()

    useEffect(() => {
        try {
            JSON.parse({w: '2'})
        } catch (e) {
            handleError(e as Error)
        }
    }, [])

    if (error) return fallback || <h1>Something went wrong!</h1>

    return children
}

export default ErrorBoundary