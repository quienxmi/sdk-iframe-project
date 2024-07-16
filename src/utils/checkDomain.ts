import AllowedDomains from '../constants/allowedDomains';

export function checkDomain(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname;
        return AllowedDomains.some(domain => {
            if (domain === 'localhost') {
                return hostname === 'localhost';
            } else {
                if (parsedUrl.protocol !== 'https:') {
                    return false;
                }
                if (domain.endsWith('.')) {
                    return hostname.slice(0, -2).endsWith(domain);
                }
                return hostname.endsWith(domain);
            }
        });
    } catch (err) {
        return false;
    }
}