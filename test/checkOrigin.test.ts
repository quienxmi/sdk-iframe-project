import { checkOrigin } from '../src/utils/checkOrigin';

describe('checkOrigin', () => {
    const originalWindow = global.window;

    beforeAll(() => {
        global.window = Object.create(global);
        Object.defineProperty(window, 'location', {
            value: {
                origin: 'https://www.quienxmi.com',
            },
            writable: true,
        });
    });

    afterAll(() => {
        global.window = originalWindow;
    });

    it('should return true for the same origin', () => {
        expect(checkOrigin('https://www.quienxmi.com')).toBe(true);
        expect(checkOrigin('https://www.quienxmi.com/path')).toBe(true);
        expect(checkOrigin('https://www.quienxmi.com:443')).toBe(true);
    });

    it('should return false for different origins', () => {
        expect(checkOrigin('http://www.quienxmi.com')).toBe(false);
        expect(checkOrigin('https://quienxmi.com')).toBe(false);
        expect(checkOrigin('https://www.anotherexample.com')).toBe(false);
        expect(checkOrigin('http://localhost')).toBe(false);
    });

    it('should return false for invalid URLs', () => {
        expect(checkOrigin('invalid-url')).toBe(false);
        expect(checkOrigin('https//example.com')).toBe(false);
        expect(checkOrigin('ftp://www.example.com')).toBe(false);
    });
});
