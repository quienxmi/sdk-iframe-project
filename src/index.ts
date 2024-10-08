import './interfaces/global.d';
import Errors from './constants/errors';
import { Config, SubscriptionTypes, Observer, DecodedToken, EventObserver, EventObserverError } from './interfaces/index';
import { checkOrigin } from './utils/checkOrigin';
import { checkDomain } from './utils/checkDomain';
import { decodeToken } from './utils/decodeToken';
import { version } from '../package.json';

const observersStructure: Observer = {
    all: [],
    resize: [],
    event: [],
    error: []
};

class QxmIframeProject {
    public _domIframe?: HTMLIFrameElement;
    public _observers: Observer = observersStructure;

    private _checkExp?: number | NodeJS.Timeout;
    private _logs = false;

    constructor(
        domOrStringIframe: HTMLIFrameElement | string,
        config: Config | null
    ) {
        try {
            const { scrolling, resize, logs } = config ?? {};

            if (typeof domOrStringIframe === 'string') {
                this._domIframe = document.querySelector(domOrStringIframe)!;
            } else {
                this._domIframe = domOrStringIframe;
            }

            if (logs === true) {
                this._logs = true;
            }

            if (this._logs) {
                console.info('[QxmIframe]: Version ' + version)
            }

            if (!this._domIframe) {
                this.pushError('IFRAME_NOT_FOUND');
                return;
            }

            if (!(this._domIframe instanceof HTMLIFrameElement)) {
                this.pushError('DOM_NOT_IFRAME');
                return;
            }

            this._domIframe.setAttribute('frameborder', '0');

            if (!(scrolling || false)) {
                this._domIframe.setAttribute('scrolling', 'no');
            }

            this.createListener();

            if (resize ?? true) {
                this.subscribe('resize', this.resize);
            }
        } catch (e: any) {
            this.pushError('SDK_CREATE', null, e);
            this.destroy();
        }
    }

    subscribe(type: SubscriptionTypes = 'all', callback: Function) {
        this._observers[type].push(callback);
    }

    subscribeError(callback: Function) {
        this.subscribe('error', callback);
    }

    subscribeEvent(callback: Function) {
        this.subscribe('event', callback);
    }

    async setToken(token: string): Promise<DecodedToken | null> {
        token = token.trim();
        const decodedToken: DecodedToken | null = decodeToken(token);
        clearInterval(this._checkExp);

        if (!decodedToken) {
            this.pushError('INVALID_TOKEN');
            return null;
        }

        if (decodedToken.aud && !checkOrigin(decodedToken.aud)) {
            this.pushError('INVALID_ORIGIN');
            return null;
        }

        if (!checkDomain(decodedToken.iss)) {
            this.pushError('INVALID_DOMAIN');
            return null;
        }

        this._checkExp = setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            if (decodedToken.exp < now) {
                clearInterval(this._checkExp);
                this.pushError('EXPIRED_TOKEN');
            }
        }, 1000);

        if (!await this.setSrcIframe(decodedToken.iss, token)) {
            return null;
        }

        return decodedToken;
    }

    destroy() {
        this._domIframe = undefined;
        this._observers = observersStructure;
        clearInterval(this._checkExp);
    }

    private setSrcIframe(domain: string, token: string): Promise<boolean> {
        return new Promise((resolve) => {
            const domIframe = this._domIframe!;

            const onLoad = () => {
                clearEvents();
                resolve(true);
            };

            const onError = () => {
                this.pushError('ERROR_LOADING_IFRAME');
                clearEvents();
                resolve(false);
            };

            const clearEvents = () => {
                domIframe.removeEventListener('load', onLoad);
                domIframe.removeEventListener('error', onError);
            }

            try {
                domIframe.src = domain + '/api/iframe/project/create?token=' + token;
                domIframe.addEventListener('load', onLoad);
                domIframe.addEventListener('error', onError);
            } catch (err) {
                onError();
            }
        });
    }

    private createListener() {
        window.addEventListener('message', (event: MessageEvent) => {
            const { origin, data } = event;
            if (checkDomain(origin)) {
                if (this._logs) {
                    console.log('[QxmIframe]:', data);
                }
                let type = data.type ?? 'all';
                if (!this._observers[type]) {
                    type = 'all';
                }
                if (type === 'error') {
                    this.pushError(data.code, data.message);
                    return;
                }
                this._observers[type].forEach((observer: Function) => observer({
                    _domIframe: this._domIframe,
                    data
                } as EventObserver));
            }
        });
    }

    private pushError(code: string, message: string | null = null, error: any = null) {
        if (!message) {
            message = Errors[code] ?? code;
        } 
        if (this._logs) {
            console.error('[QxmIframe]:', message, error);
        }
        this._observers.error.forEach((observer: Function) => observer({
            _domIframe: this._domIframe,
            code,
            message,
            error
        } as EventObserverError));
    }

    private resize(event: EventObserver) {
        const { _domIframe, data } = event;
        const styles = window.getComputedStyle(_domIframe);
        const iframePadding = parseInt(styles.paddingTop) + parseInt(styles.paddingBottom);
        _domIframe.style.setProperty('height', `${data.height + iframePadding}px`, 'important');
    }
}

if (typeof window !== 'undefined') {
    window.QxmIframeProject = QxmIframeProject;
}

export default QxmIframeProject;