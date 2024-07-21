export interface Errors {
    [key: string]: string;
}

export interface Config {
    scrolling?: boolean;
    resize?: boolean;
    alert?: boolean;
    logs?: boolean;
}

export type SubscriptionTypes = 'all' | 'resize' | 'modals' | 'error';

export interface Observer {
    [key: string]: Function[];
}

export interface EventObserver {
    _domIframe: HTMLIFrameElement;
    _observers: Observer;
    data: any;
}

export interface EventObserverError {
    _domIframe: HTMLIFrameElement;
    _observers: Observer;
    code: string;
    message: string;
    error: any;
}

export interface DecodedToken {
    aud?: string | null;
    iss: string;
    iat: number;
    exp: number;
    data: {
        id: string;
        user: string;
        partner: string;
    }
}