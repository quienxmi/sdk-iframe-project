import { Config, SubscriptionTypes, Observer, TokenDecode, EventObserver } from '@interfaces';
import './interfaces/global.d';
import Errors from './constants/errors';
import { checkDomain } from './utils/checkDomain';
import { decodeToken } from './utils/decodeToken';
import { version } from '../package.json';

const observersStructure = {
    all: [],
    resize: [],
    modals: [],
    error: []
};

class QxmIframeProject {
    public _domIframe?: HTMLIFrameElement;
    public _observers: Observer = observersStructure;
    
    private _checkExp?: number | NodeJS.Timeout;
    private _logs = false;

    constructor(domOrStringIframe: HTMLIFrameElement | string, config: Config) {
        try {
            const { scrolling, resize, logs } = config;

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
                this.errorLog('IFRAME_NOT_FOUND');
                return;
            }

            if (!(this._domIframe instanceof HTMLIFrameElement)) {
                this.errorLog('DOM_NOT_IFRAME');
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
            this.errorLog('SDK_CREATE', e);
        }
    }

    subscribe(type: SubscriptionTypes = 'all', callback: Function) {
        this._observers[type].push(callback);
    }

    error(callback: Function) {
        this.subscribe('error', callback);
    }

    modals(callback: Function) {
        this.subscribe('modals', callback);
    }

    async setToken(token: string): Promise<TokenDecode | null> {
        const tokenDecode: TokenDecode | null = decodeToken(token);

        if (!tokenDecode) {
            this.errorLog('INVALID_TOKEN');
            return null;
        }

        if (!checkDomain(tokenDecode.iss)) {
            this.errorLog('INVALID_DOMAIN');
            return null;
        }

        this._checkExp = setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            if (tokenDecode.exp < now) {
                this.errorLog('EXPIRED_TOKEN');
                clearInterval(this._checkExp);
            }
        }, 1000);

        if (!await this.setSrcIframe(tokenDecode.iss, token)) {
            return null;
        }

        return tokenDecode;
    }

    destroy() {
        this._domIframe = undefined;
        this._observers = observersStructure;
    }

    private setSrcIframe(domain: string, token: string): Promise<boolean> {
        return new Promise((resolve) => {
            const domIframe = this._domIframe!;

            const onLoad = () => {
                clearEvents();
                resolve(true);
            };

            const onError = () => {
                this.errorLog('ERROR_LOADING_IFRAME');
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
                this._observers[type].forEach((observer: Function) => observer({
                    _domIframe: this._domIframe,
                    data
                }));
            }
        });
    }

    private errorLog(code: string, error: any = null) {
        const message = Errors[code] ?? code;
        if (this._logs) {
            console.error('[QxmIframe]:', message, error);
        }
        this._observers.error.forEach((observer: Function) => observer({
            _domIframe: this._domIframe,
            code,
            message,
            error
        }));
    }

    private resize(event: EventObserver) {
        const { _domIframe, data } = event;
        const styles = window.getComputedStyle(_domIframe);
        const iframePadding = parseInt(styles.paddingTop) + parseInt(styles.paddingBottom);
        _domIframe.style.setProperty('height', `${data.height + iframePadding}px`, 'important');
    }
}

export default QxmIframeProject;
window.QxmIframeProject = QxmIframeProject;