import './interfaces/global.d';

export const loadQxmIframeProject = (() => {
    return new Promise((resolve) => {
        const checkSdkLoaded = () => {
            if ((typeof window !== 'undefined') && (typeof window.QxmIframeProject === 'function')) {
                resolve(true);
            } else {
                setTimeout(checkSdkLoaded, 100);
            }
        }
        checkSdkLoaded();
    })
});

window.loadQxmIframeProject = loadQxmIframeProject;