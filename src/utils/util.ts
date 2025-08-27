export const fetchData = async (URI: string) => {
    try {
        const response = await fetch(URI)
        return await response.json()
    } catch (err) {
        console.error(err)
    }
}