function FallbackRender({
    error
}: {
    error: Error
}) {
    return (
        <div className="error-component">
            <h1>Something went wrong: </h1>
            <span style={{color: 'red'}}>{error.message}</span>
        </div>
    )
}

export default FallbackRender