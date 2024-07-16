import { decodeToken } from '../src/utils/decodeToken';

const generateJWT = (payload: object): string => {
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    return `eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.${base64Payload}.`;
}

const generateTime = (): number => {
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime + (60 * 60);
}

describe('decodeToken', () => {
    it('should correctly decode a valid token', () => {
        const obj = {
            aud: 'http://localhost:4200',
            iss: 'http://localhost:8000',
            iat: 1721159152,
            exp: generateTime(),
            data: {
                id: 'd9c4d383-94b8-485e-ba46-2b590f2826bd',
                user: '7e245d1d-1089-4932-a676-801fb1579012',
                partner: '725392e9-ff6c-446a-9e44-330a5c274ff6'
            }
        };
        const token = generateJWT(obj);
        expect(decodeToken(token)).toStrictEqual(obj);
    });

    it('should return null for an expired token', () => {
        const obj = {
            aud: 'http://localhost:4200',
            iss: 'http://localhost:8000',
            iat: 1721159152,
            exp: 1720621059,
            data: {
                id: 'd9c4d383-94b8-485e-ba46-2b590f2826bd',
                user: '7e245d1d-1089-4932-a676-801fb1579012',
                partner: '725392e9-ff6c-446a-9e44-330a5c274ff6'
            }
        };
        const token = generateJWT(obj);
        expect(decodeToken(token)).toBe(null);
    });

    it('should return null for a token with incorrect structure', () => {
        const obj = {
            aud: 'http://localhost:4200',
            iss: 'http://localhost:8000',
            test: 'Test Code',
            exp: generateTime()
        };
        const token = generateJWT(obj);
        expect(decodeToken(token)).toBe(null);
    });

    it('should return null for an invalid token', () => {
        expect(decodeToken('')).toBe(null);
        expect(decodeToken('tokenerrortest')).toBe(null);
        expect(decodeToken('token.error.test')).toBe(null);
    });
});