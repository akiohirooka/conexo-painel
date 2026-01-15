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
