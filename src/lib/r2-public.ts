export function getPublicR2Url(key: string): string {
    const baseUrl = process.env.R2_PUBLIC_BASE_URL;

    if (!baseUrl) {
        throw new Error('R2_PUBLIC_BASE_URL environment variable is missing');
    }

    // Remove trailing slash from base and leading slash from key to avoid double slashes
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const cleanKey = key.replace(/^\/+/, '');

    return `${cleanBase}/${cleanKey}`;
}

/**
 * Extract R2 key (path) from full public URL
 * Example: "https://conexo-app.r2.dev/business/15/logo/logo.jpeg" -> "business/15/logo/logo.jpeg"
 */
export function extractR2KeyFromUrl(url: string): string {
    const baseUrl = process.env.R2_PUBLIC_BASE_URL;

    if (!baseUrl) {
        // If no base URL configured, assume it's already a key
        return url;
    }

    const cleanBase = baseUrl.replace(/\/+$/, '');

    // If URL starts with base, extract the key
    if (url.startsWith(cleanBase)) {
        return url.substring(cleanBase.length + 1); // +1 to skip the slash
    }

    // Otherwise, assume it's already a key/path
    return url;
}
