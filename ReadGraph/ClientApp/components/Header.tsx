import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';

import * as UserAuth from '../services/userAuth';

import { AppointmentCalendar } from './Calendar';

interface HeaderState {
    user: UserAuth.User | null
    authenticating: boolean
    authenticated: boolean
}

export class Header extends React.Component<{}, HeaderState> {

    constructor() {
        super();

        let demoMode = window.localStorage.getItem('demoMode') === 'enabled';

        if (demoMode) {
            // DEMO MODE
            this.state = {
                user: null,
                authenticating: false,
                authenticated: true
            };
        } else {
            this.state = {
                user: null,
                authenticating: true,
                authenticated: false
            };

            if (!demoMode) {
                UserAuth.instance.checkStatus().then(user => {
                    console.log(user)
                    this.setState({
                        user: user,
                        authenticated: !!user,
                        authenticating: false
                    });
                })
            }
        }
    }

    login(e) {
        e.preventDefault();
        this.setState({ authenticating: true });
        UserAuth.instance.login();
    }

    logout(e) {
        e.preventDefault();
        this.setState({ authenticating: true, authenticated: false, user: null });
        UserAuth.instance.logout();
    }

    public render() {

        let showLogin = !this.state.authenticating && !this.state.authenticated;
        let showInsights = !this.state.authenticating && this.state.authenticated;

        return (<header id="header">
            <div id="head"></div>

            {showInsights && this.showInsights()}

            {showLogin && this.showLogin()}

            <div id="openCose"></div>

        </header>);
    }

    private showLogin() {
        return (<div id="login">
                    <p>Please login to retrieve your insights and appointments.</p>
                    <p><a href="#" onClick={this.login.bind(this)}>Continue</a></p>
                </div>);
    }

    private showInsights() {
        return (<div id="insights">
                    {this.state.user &&
                        (<div id="logout">
                            {this.state.user.name}
                            &nbsp;|&nbsp;
                            <a href="#" onClick={this.logout.bind(this)}>Sign out</a>
                        </div>
                        )}
                    <div className="insightCol">
                    <div className="insight rate">
                        <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
                            <circle className="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="transparent"></circle>
                            <circle className="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f6f6f6" strokeWidth="5"></circle>
                            <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#79d9ea" strokeWidth="5" strokeDasharray="85 15" strokeDashoffset="0"></circle>
                        </svg>
                        <h4 className="insightHeader">Clarity Rate</h4>
                    </div>

                    <div className="insight insightRate">
                        <div className="insightOne">
                            24
                    <p>New Insights</p>
                        </div>
                        <div className="insightTwo">
                            <p>We can invite your closest co-workers to this session.</p>
                            <button id="inviteCoworker">invite them</button>
                        </div>
                    </div>
                    </div>
                    <div className="insightCol">
                    <h2 className="calHead">Today's Calendar</h2>
                    <AppointmentCalendar />
                    </div>
                </div>);
    }
}
