

// Use ngrok when hosting locally, this url is used as the listening endpoint on Graph API Subscriptions
// export const BackendBaseUrl: string = 'https://XXXXX.ngrok.io';
export const BackendBaseUrl = window.location.protocol + "//" + window.location.host;

// This is the AzureAD Client ID, generate a new application @ https://apps.dev.microsoft.com/#/appList
// and replace the next value with the generated ApplicationId
export const AzureAdApplicationId = 'ddd3661d-a359-4a45-9f2a-a2aa435877df';
