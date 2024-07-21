import AllowedDomains from '../constants/allowedDomains';

export function checkDomain(url: string): boolean {
    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.hostname === 'localhost') {
            return parsedUrl.port === '8000';
        }

        if (parsedUrl.protocol !== 'https:') {
            return false;
        }

        const hostname = parsedUrl.hostname;
        return AllowedDomains.some(domain => {
            if (domain.endsWith('.')) {
                return hostname.slice(0, -2).endsWith(domain);
            }
            return hostname.endsWith(domain);
        });
    } catch (err) {
        return false;
    }
}