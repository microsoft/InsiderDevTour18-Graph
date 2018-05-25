import { Client as GraphClient } from '@microsoft/microsoft-graph-client';
import { UserAgentApplication, User } from 'msal';
import { AzureAdApplicationId } from './config';

const graphScopes = ['user.read', 'mail.read', 'calendars.readwrite'];
const redirectUri = window.location.href;

export { User } from 'msal';

export class UserAuth {

    private adalClient: UserAgentApplication;

    constructor() {
        this.adalClient = new UserAgentApplication(
            AzureAdApplicationId,
            null,
            (errorDesc, token, error, tokenType) => {
                if (!token) {
                    console.log('AdalClient.init', error + ":" + errorDesc);
                }
            },
            { cacheLocation: 'localStorage' });
    }

    async checkStatus(): Promise<User | null> {
        try {
            let token = await this.adalClient.acquireTokenSilent(graphScopes);
            let user = await this.adalClient.getUser();
            return user;
        } catch (err) {
            console.log('AdaClient.checkStatus', err)
            return null;
        }
    }

    async acquireToken(): Promise<string> {
        return this.adalClient.acquireTokenSilent(graphScopes);
    }

    login(): void {
        this.adalClient.loginRedirect(graphScopes);
    }

    logout(): void {
        this.adalClient.logout();
    }
}

export const instance = new UserAuth();