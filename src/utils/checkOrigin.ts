export function checkOrigin(url: string): boolean {
    try {
        const providedOrigin = new URL(url).origin;
        return providedOrigin === window.location.origin;
    } catch (err) {
        return false;
    }
}