import { EventEmitter } from 'events';
import { CalendarAppointment } from './calendar';

export interface CalendarStoreUpdateEvent {
    appointment: CalendarAppointment
    appointments: Array<CalendarAppointment>
}

class CalendarStore extends EventEmitter {
    private appointments: Array<CalendarAppointment> = new Array<CalendarAppointment>();

    public reset(newAppointments: Array<CalendarAppointment>): void {
        this.appointments = newAppointments.slice(0);
        this.emit('update', {
            appointments: this.appointments.slice(0)
        });
    }

    public add(appointment: CalendarAppointment) {
        this.appointments.push(appointment);
        this.emit('update', {
            appointments: this.appointments.slice(0),
            appointment: appointment
        });
    }

    public get(): Array<CalendarAppointment> {
        return this.appointments.slice(0);
    }
}

export const instance = new CalendarStore();