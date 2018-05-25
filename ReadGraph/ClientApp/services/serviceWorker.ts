declare var window: any;
let serviceWorkerRegistration: ServiceWorkerRegistration;

export function init(): Promise<ServiceWorkerRegistration> {
    return new Promise<ServiceWorkerRegistration>((resolve, reject) => {
        // register service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(
                    (registration) => {
                        // Registration was successful
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                        serviceWorkerRegistration = registration;
                        resolve(registration);
                    }, (err) => {
                        // registration failed
                        console.log('ServiceWorker registration failed: ', err);
                        reject(err);
                    });
            });
        } else {
            reject(new Error('ServiceWorker is not supported in this browser.'));
        }
    });
}

export const getServiceWorkerRegistration = (): ServiceWorkerRegistration => serviceWorkerRegistration;