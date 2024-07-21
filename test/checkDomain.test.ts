import { checkDomain } from '../src/utils/checkDomain';

describe('checkDomain', () => {
    it('should return true for allowed domains', () => {
        expect(checkDomain('http://localhost:8000')).toBe(true);
        expect(checkDomain('https://www.quienxmi.com')).toBe(true);
        expect(checkDomain('https://munitest.sandboxqxm.com')).toBe(true);
        expect(checkDomain('https://munitest.qxm.com.ar')).toBe(true);
    });

    it('should return false for disallowed domains', () => {
        expect(checkDomain('http://localhost:4200')).toBe(false);
        expect(checkDomain('https://qxm.com.ar')).toBe(false);
        expect(checkDomain('http://example.com')).toBe(false);
        expect(checkDomain('http://sub.example.com')).toBe(false);
        expect(checkDomain('http://notallowed.qxm.com')).toBe(false);
        expect(checkDomain('http://munitest.qxm.com.ar')).toBe(false);
    });

    it('should return false for invalid URLs', () => {
        expect(checkDomain('https//munitest.qxm.com.ar')).toBe(false);
        expect(checkDomain('https://www.municipio.com.ar')).toBe(false);
        expect(checkDomain('https://www.google.com')).toBe(false);
    });
});