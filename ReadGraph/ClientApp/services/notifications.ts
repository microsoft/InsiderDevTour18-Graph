declare var window: any;
declare var Windows: any;

import * as ServiceWorker from './serviceWorker';
import { BackendBaseUrl } from './config';

export function register() {
    Notification.requestPermission((result) => console.log('Notification permission request:', result));
}

export function showNotification(title: string, body: string) {
    var serviceWorkerRegistration = ServiceWorker.getServiceWorkerRegistration();
    if (!serviceWorkerRegistration) return;

    // use Windows notification, default to Service Worker notification
    return showWindowsNotification(title, body, '/images/goat-notification.png') || serviceWorkerRegistration.showNotification(title, {
        body: body,
        image: '/images/goat-notification.png',
        icon: '/images/icons/icon-96x96.png',
        vibrate: 100
    } as any);
}

export async function registerNativePushNotification(): Promise<string | null> {
    if (!window.Windows) return null;

    // Device ID
    let deviceId = getDeviceId();

    // Create Push Notification channel
    let pushNotifications = Windows.Networking.PushNotifications;
    let channelOperation = await pushNotifications.PushNotificationChannelManager.createPushNotificationChannelForApplicationAsync();
    let channelUri = channelOperation.uri as string;

    // Call backend to register channel with deviceId tag
    let registerUri = BackendBaseUrl + '/api/notifications/register';
    await fetch(registerUri, {
        body: JSON.stringify({
            channelUri,
            deviceId
        }),
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: 'POST',
        mode: 'cors'
    });

    // Log notifications
    channelOperation.onpushnotificationreceived = (notification) => console.log('PushNotification recieved', notification);

    return deviceId;
}

function showWindowsNotification(title: string, body: string, image: string) {
    if (!window.Windows) return false;

    var notifications = Windows.UI.Notifications;

    // Get the toast notification manager for the current app.
    var notificationManager = notifications.ToastNotificationManager;

    var toastXml = new Windows.Data.Xml.Dom.XmlDocument();
    toastXml.loadXml('<toast><visual><binding template="ToastGeneric"><text hint-maxLines="1"></text><text></text><image placement="" src=""/></binding></visual></toast>')

    // You can use the methods from the XML document to specify the required elements for the toast.
    var images = toastXml.getElementsByTagName("image");

    var url = window.location.protocol + "//" + window.location.host + image;

    images[0].setAttribute("src", url);

    // Use hero image
    // images[0].setAttribute("placement", "hero");

    //Set notification text
    var textNodes = toastXml.getElementsByTagName("text");
    textNodes[0].innerText = title;
    textNodes[1].innerText = body;

    // Create a toast notification from the XML, then create a ToastNotifier object
    // to send the toast.
    var toast = new notifications.ToastNotification(toastXml);

    notificationManager.createToastNotifier().show(toast);

    return true;
}

function getDeviceId() {
    let deviceId = "";
    let packageSpecificToken = Windows.System.Profile.HardwareIdentification.getPackageSpecificToken(null);
    let hardwareId = packageSpecificToken.id;
    let dataReader = Windows.Storage.Streams.DataReader.fromBuffer(hardwareId);

    let array = new Array(hardwareId.length);
    dataReader.readBytes(array);
    for (let i = 0; i < array.length; i++) {
        deviceId += array[i].toString();
    }
    return deviceId;
}