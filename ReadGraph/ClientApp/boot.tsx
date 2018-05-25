import './css/site.css';
import 'react-image-lightbox/style.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import * as RoutesModule from './routes';
let routes = RoutesModule.routes;

import * as CalendarStore from './models/calendarStore';

import * as UserAuth from './services/userAuth';
import * as Notifications from './services/notifications';
import * as ServiceWorker from './services/serviceWorker';
import * as LockScreen from './services/lockScreen';
import * as GraphServices from './services/graphServices';

function renderApp() {
    // This code starts up the React app when it runs in a browser. It sets up the routing
    // configuration and injects the app into a DOM element.
    const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
    ReactDOM.render(
        <AppContainer>
            <BrowserRouter children={routes} basename={baseUrl} />
        </AppContainer>,
        document.getElementById('react-app')
    );
}


// Init Service Worker and Notifications
ServiceWorker.init().then(() =>
    Notifications.register());

// Demo Mode toggler
let demoMode = window.localStorage.getItem('demoMode') === 'enabled';
window.addEventListener('keyup', (e: any) => {
    if(e.key && e.key.toLowerCase() === 'd' && e.shiftKey) {
        let newMode = demoMode ? 'disabled' : 'enabled';
        window.localStorage.setItem('demoMode', newMode);
        alert('Demo mode "' + newMode + '"');
        window.location.reload(true);
    }
});

const meetingDurationThreshold = 60;              // 1 hour

//set mode for second run

let secondRun  = window.localStorage.getItem('secondRun') === 'enabled';
if (secondRun) {
    window.localStorage.setItem('secondRun', 'disabled');
    document.body.classList.add('secondRun');
    CalendarStore.instance.add({ from: 1400, to: 1430, details: 'Budget Meeting', type: 'meeting showInsightOne', insight: true })
    CalendarStore.instance.add({ from: 1430, to: 1700, details: '', type: 'meeting' });
    CalendarStore.instance.add({ from: 1700, to: 1730, details: 'relaxation', type: 'relax showInsightTwo', insight: true })

}

if (demoMode) {
    // DEMO/MOCK MODE
    // Init Calendar
    CalendarStore.instance.add({ from: 1100, to: 1130, details: 'PWA Roadmap Planning', type: 'meeting' });
    CalendarStore.instance.add({ from: 1200, to: 1230, details: 'Lunch', type: 'other' });
    CalendarStore.instance.add({ from: 1230, to: 1300, details: '', type: 'other' });

    // (DEMO) Trigger on KeyPresses
    window.addEventListener('keyup', (e: any) => {
        let key = e.key.toLowerCase();
        switch (key) {
            case 'n':
                return Notifications.showNotification('You are getting lots of emails!', 'Here, have a goat picture!');
            case 'b':
                return LockScreen.changeWindowsLockScreenImage('lock-screen.jpg');
            case 'a':
                CalendarStore.instance.add({ from: 1400, to: 1430, details: 'Budget Meeting', type: 'meeting showInsightOne', insight: true })
                CalendarStore.instance.add({ from: 1430, to: 1700, details: '', type: 'meeting' });
                window.localStorage.setItem('secondRun', 'enabled');
                return;
            case 's':
                CalendarStore.instance.add({ from: 1700, to: 1730, details: 'relaxation', type: 'relax showInsightTwo', insight: true })
                return;
        }
    });
} else {
    // REAL MODE
    UserAuth.instance.checkStatus().then(user => {
        if (user) {
            // Retrieve calendar
            let appointmentsPromise = GraphServices.instances.calendar.retrieveCalendarForToday();

            // Update calendar UI
            appointmentsPromise.then(appointments => CalendarStore.instance.reset(appointments));

            // Check for long meeting and add yoga session
            appointmentsPromise.then(appointments => {
                var meetings = appointments.filter(m => m.duration && m.duration > meetingDurationThreshold);
                if (meetings.length) {
                    GraphServices.instances.calendar.addRelaxationEventsAfter(meetings)
                        .then(relaxationEvents => {
                            relaxationEvents.forEach(m => {
                                let relax = Object.assign({}, m, { type: 'relax showInsightTwo', insight: true});
                                CalendarStore.instance.add(relax);
                            });
                        });
                }
            })

            // Subscribe for 'email sent' notifications
            // Create PushNotification channel, and use deviceId as clientState for the notification
            // When backend recieved notification, the deviceId will be enough to direct the notification to this device
            Notifications.registerNativePushNotification().then(deviceId => {
                if (!deviceId) return console.log('Could not register PushNotification channel. Non-native medium?');

                GraphServices.instances.subscription.registerForEmailsSent(deviceId);
            });

            // TODO: Update Insights
        }
    });
}

// Init app
renderApp();
declare var Windows: any;
if (typeof Windows !== 'undefined') {
    document.body.classList.add('showOne')
}

// Allow Hot Module Replacement
if (module.hot) {
    module.hot.accept('./routes', () => {
        routes = require<typeof RoutesModule>('./routes').routes;
        renderApp();
    });
}
