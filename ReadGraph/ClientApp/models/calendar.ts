export interface CalendarAppointment {
    from: number;
    fromDateTime?: string;
    to: number;
    toDateTime?: string;
    duration?: number;
    details?: string;
    type?: string;
    insight?: boolean;
}

export class CalendarRow {
    public time: string;
    public taken: boolean;
    public details: string;
    public type: string;
    public insight: boolean;
    public appointments: Array<CalendarAppointment>;

    constructor(appointments: Array<CalendarAppointment>, time: string, taken: boolean = false, details?: string, type?: string, insight: boolean = false) {
        this.appointments = appointments;
        this.time = time;
        this.taken = taken;
        this.details = details || '';
        this.type = type || '';
        this.insight = insight;
    }
}

// E.g.: from: 1200 (12:00 PM), to: 1830 (6:30 PM)
export function appointmentsToRows(from: number, to: number, appointments: Array<CalendarAppointment>): Array<CalendarRow> {
    let rows = new Array<CalendarRow>();
    for(let curr = from; curr <= to; curr = curr + 50) {
        let min = (curr / 100 % 1) === .3 ? '30' : '00'
        let time = Math.floor(curr / 100).toString() + ':' + min;

        let matched = appointments.filter(a => curr >= a.from && curr < a.to);
        let details = matched.map(a => a.details).join(', ');
        let type = matched.length ? matched[0].type : '';

        let row = new CalendarRow(matched, time, matched.length > 0, details, type);
        rows.push(row);
    }

    return rows;
}