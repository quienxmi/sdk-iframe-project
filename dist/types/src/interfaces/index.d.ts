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
export interface TokenDecode {
    iss: string;
    iat: number;
    exp: number;
    data: {
        id: string;
        user: string;
        partner: string;
    };
}
export interface EventObserver {
    _domIframe: HTMLIFrameElement;
    _observers: Observer;
    data: any;
}
