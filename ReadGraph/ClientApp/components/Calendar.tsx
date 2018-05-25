import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Listener } from 'events';

import * as CalendarModel from '../models/calendar';
import * as CalendarStore from '../models/calendarStore';

let store = CalendarStore.instance;

export interface AppointmentCalendarState {
    appointments: Array<CalendarModel.CalendarAppointment>;
    newAppointment?: CalendarModel.CalendarAppointment;
}

export class AppointmentCalendar extends React.Component<{}, AppointmentCalendarState> {
    _handleStoreUpdate: Listener;
    constructor() {
        super();
        this.state = { appointments: store.get() };
        this._handleStoreUpdate = this.onStoreUpdate.bind(this);
    }

    componentWillMount() {
        store.addListener('update', this._handleStoreUpdate);
    }

    componentWillUnmount() {
        store.removeListener('update', this._handleStoreUpdate);
    }

    onStoreUpdate(e: CalendarStore.CalendarStoreUpdateEvent) {
        let newAppt = e.appointment;
        this.setState({
            appointments: e.appointments,
            newAppointment: newAppt
        });
    }

    public render() {
        let rows = CalendarModel.appointmentsToRows(1000, 1800, this.state.appointments);

        // HACK
        if (this.state.newAppointment) {
            let newRoxIx = rows.findIndex(r => r.appointments.indexOf(this.state.newAppointment as CalendarModel.CalendarAppointment) > -1);
            let divIx = newRoxIx * 4;
            setTimeout(() => {
                let schedule = document.getElementById('schedule');
                if (!schedule) return;
                schedule.children[divIx].scrollIntoView({
                    behavior: 'smooth'
                });
            }, 150);
        }

        return (<div className="insight" id="schedule">
            
            {rows.map(r => asRow(r))}
        </div>);
    }
}

function getClassName(row: CalendarModel.CalendarRow, className: string): string {
    return className + ' ' + (row.taken ? 'taken ' + row.type : '');
}


function asRow(r: CalendarModel.CalendarRow) {
    if (r.taken) {
        return [
            <div className="time">{r.time}</div>,
            <div className={getClassName(r, 'status')}></div>,
            <div className={getClassName(r, 'halfHour')}>{r.details}</div>,
            <LinkedDiv className={getClassName(r, 'goatInsight')}></LinkedDiv>

        ];
    } else {
        return [
            <div className="time">{r.time}</div>,
            <div className="status"></div>,
            <div className="halfHour"></div>,
            <div className="goatInsight"></div>

        ];
    }
}

const LinkedDiv = withRouter<React.HTMLProps<HTMLDivElement>>(
    class BaseLinkedDiv extends React.Component<RouteComponentProps<React.HTMLProps<HTMLDivElement>>, {}> {
        constructor(props) {
            super(props)
        }

        render() {
            if ((this.props as any).className.includes('showInsightTwo')) {
                let updateBody = () => document.body.classList.add('showInvite');
                let className = (this.props as any).className;
                return <div onClick={updateBody} className={className}>{this.props.children}</div>;

            } else {
                let navigateToPlayer = () => (this.props as any).history.push('/video');
                let className = (this.props as any).className;
                return <div onClick={navigateToPlayer} className={className}>{this.props.children}</div>;

            }
      }
    });