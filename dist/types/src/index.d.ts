import { Config, SubscriptionTypes, Observer, TokenDecode } from './interfaces/index.ts';

declare class QxmIframeProject {
    _domIframe?: HTMLIFrameElement;
    _observers: Observer;
    private _checkExp?;
    private _logs;
    constructor(domOrStringIframe: HTMLIFrameElement | string, config: Config | null);
    subscribe(type: SubscriptionTypes | undefined, callback: Function): void;
    error(callback: Function): void;
    modals(callback: Function): void;
    setToken(token: string): Promise<TokenDecode | null>;
    destroy(): void;
    private setSrcIframe;
    private createListener;
    private errorLog;
    private resize;
}
export default QxmIframeProject;
