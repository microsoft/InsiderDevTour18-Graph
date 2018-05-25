import { Client as GraphClient } from '@microsoft/microsoft-graph-client';

import * as moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(moment);
import * as UserAuth from './userAuth';
import { CalendarAppointment } from '../models/calendar';
import { BackendBaseUrl } from './config';

abstract class BaseService {

    protected client: GraphClient;

    constructor() {
        this.client = GraphClient.init({
            defaultVersion: 'beta',
            authProvider: (done) => {
                // retrieve token from ADAL client
                UserAuth.instance.acquireToken()
                    .then(token => done(null, token))
                    .catch(err => {
                        console.log('adal.error', err)
                        done(err, '');
                    });
            }
        });
    }
}


// Using user's timezone
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

class CalendarService extends BaseService {
    async retrieveCalendarForToday(): Promise<Array<CalendarAppointment>> {
        // Get Calendar for today
        let today = moment().startOf('day');

        let response = await this.client
            .api('/me/calendarview')
            .header('Prefer', `outlook.timezone="${userTimezone}"`)
            .query('startdatetime=' + today.format())
            .query('enddatetime=' + today.add(1, 'days').format())
            .top(100)
            .get();

        // Map to CalendarAppointment
        return response.value.map(asCalendarAppointment);
    }

    async addRelaxationEventsAfter(meetings: Array<CalendarAppointment>): Promise<Array<CalendarAppointment>> {
        // schedule a "relaxation" session after each meeting

        // 1. read the attachment image
        let base64img = await asDataUri('images/goat-notification.png');

        // 2. for each detected meeting, create a new event
        let relaxationEvents = new Array<any>();
        await meetings.map(e => {
            let start = moment(new Date(e.toDateTime as string));
            let end = moment(new Date(e.toDateTime as string)).add(30, 'minutes');
            let relaxationEvent = {
                subject: "relaxation",
                start: {
                    dateTime: start.format(),
                    timeZone: userTimezone
                },
                end: {
                    dateTime: end.format(),
                    timeZone: userTimezone
                }
            };

            relaxationEvents.push(relaxationEvent);

            return this.client
                .api('/me/events')
                .post(relaxationEvent)
                .then((res) => {
                    // 3. Update event with attachment
                    let id = res.id;
                    let attachment = {
                        '@odata.type': '#microsoft.graph.fileAttachment',
                        'name': 'goat.png',
                        'contentBytes': base64img
                    };
                    return this.client
                        .api(`/me/events/${id}/attachments`)
                        .post(attachment)
                });
        });

        return relaxationEvents.map(asCalendarAppointment);
    }
}

class SubscriptionService extends BaseService {
    static readonly SentMailResourcePath: string = 'me/mailFolders(\'SentItems\')/messages'

    async registerForEmailsSent(deviceId: string): Promise<void> {
        let response = await this.client
            .api('/subscriptions')
            .get();

        let subscription = response.value.find(s => s.resource.toLowerCase() === SubscriptionService.SentMailResourcePath.toLowerCase());

        if (subscription) {
            // if exist and deviceId differs, delete it!
            if (subscription.clientState !== deviceId) {
                console.log('Subscription does not match, deleting...', subscription);
                await this.client.api(`/subscriptions/${subscription.id}`).delete();
            } else {
                console.log('Already subscribed to EmailsSent', subscription);
                return;
            }
        }

        let listenUri = BackendBaseUrl + '/api/notifications/listen_graph'
        subscription = {
            'changeType': 'created',
            'notificationUrl': listenUri,
            'resource': SubscriptionService.SentMailResourcePath,
            'expirationDateTime': moment().startOf('day').add(4200, 'minutes').format(),
            'clientState': deviceId
        };

        try {
            response = await this.client.api('/subscriptions').post(subscription);
            console.log('Subscribed', response);
        } catch (err) {
            console.error('Graph.Subscription.Error', err);
        }
    }
}

export const instances = {
    calendar: new CalendarService(),
    subscription: new SubscriptionService()
};

const asCalendarAppointment = (o): CalendarAppointment => ({
    from: getTime(o.start.dateTime),
    fromDateTime: o.start.dateTime,
    to: getTime(o.end.dateTime),
    toDateTime: o.end.dateTime,
    duration: getDuration(o.start.dateTime, o.end.dateTime).asMinutes(),
    details: o.subject,
    type: 'meeting',                                              // TODO: Review
    insight: o.subject.toLowerCase().includes('goat')      // TODO: REVIEW!
})

const getTime = (dateTime: string): number => {
    return parseInt(moment(new Date(dateTime)).format('HHmm'), 10);
}

const getDuration = (start: string, end: string): any => {
    let time = new Date(end).getTime() - new Date(start).getTime();
    return moment.duration(time, "milliseconds");
}

const asDataUri = (url) => {
    return new Promise((resolve, reject) => {
        var image: any = new Image();
        image.onload = function () {
            var canvas: any = document.createElement('canvas');
            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

            canvas.getContext('2d').drawImage(this, 0, 0);
            var base64 = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
            resolve(base64);
        };

        image.src = url;
    });
};