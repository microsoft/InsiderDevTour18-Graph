import { BackendBaseUrl } from "./config";

declare var window: any;
declare var Windows: any;

export async function createTimelineActivity(id: string, displayText: string, picUri: string): Promise<boolean> {
    if (!window.Windows) {
        return false;
    }

    var adaptiveCardJson = {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.0",
        "backgroundImage": BackendBaseUrl + picUri,
        "body": [
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "//BUILD 2018",
                        "weight": "bolder",
                        "size": "large",
                        "wrap": true,
                        "maxLines": 3
                    },
                    {
                        "type": "TextBlock",
                        "text": displayText,
                        "size": "default",
                        "wrap": true,
                        "maxLines": 3
                    }
                ]
            }
        ]
    }

    try {
        const channel = Windows.ApplicationModel.UserActivities.UserActivityChannel.getDefault();

        let activity = await channel.getOrCreateUserActivityAsync(id);

        let adaptiveCard = Windows.UI.Shell.AdaptiveCardBuilder.createAdaptiveCardFromJson(JSON.stringify(adaptiveCardJson));
        activity.visualElements.content = adaptiveCard;

        await activity.saveAsync()
        activity.createSession();

        return true;
    }
    catch (err) {
        console.error('createTimelineActivity.error!', err);
    }

    return false;
}