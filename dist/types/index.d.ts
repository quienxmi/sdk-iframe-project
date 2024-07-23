import { Config, SubscriptionTypes, Observer, DecodedToken } from './interfaces/index';
declare class QxmIframeProject {
    _domIframe?: HTMLIFrameElement;
    _observers: Observer;
    private _checkExp?;
    private _logs;
    constructor(domOrStringIframe: HTMLIFrameElement | string, config: Config | null);
    subscribe(type: SubscriptionTypes | undefined, callback: Function): void;
    subscribeError(callback: Function): void;
    subscribeEvent(callback: Function): void;
    setToken(token: string): Promise<DecodedToken | null>;
    destroy(): void;
    private setSrcIframe;
    private createListener;
    private pushError;
    private resize;
}
export default QxmIframeProject;
