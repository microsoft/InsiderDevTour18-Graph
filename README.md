# Setup

Setup

- Clone or download this repo on your local harddrive
- Install Visual Studio 2017: https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=Community&rel=15
- Launch Visual Studio 2017
- Go into the "ReadGraph" folder and open the "demo-app.sln" solution
- In the "Solution Explorer", open the "graphApp" folder
- Open "graphHelper.js" and "index.js" files
- Launch the app in MS Edge. The home page will say "Please login to retrieve your insights and appointments"
- Press CTRL+SHIFT+D to enter demo mode
- Now, open the second project via the "ContosoInsurance.sln" solution and force a rebuild of the solution
- Open "CasePage.xaml.cs" available under the "Pages" folder
- Move to the GenerateUserActivity method

## Prepare a couple of code snippets in the Visual Studio toolbox:
1. 1st for UserActivity:

```cs
_userActivityChannel = UserActivityChannel.GetDefault();
_userActivity = await _userActivityChannel.GetOrCreateUserActivityAsync($"Case {selectedCase.Id}");
```

2. 2nd for Deep Linking:

```cs
_userActivity.ActivationUri = new Uri($"contoso-insurance://case?{selectedCase.Id}");
_userActivity.VisualElements.DisplayText = $"Case {selectedCase.Id}";
```

3. 3rd Layout Customization:

```cs
_userActivity.VisualElements.Description = $"Opened by {selectedCase.FullName}";
_userActivity.VisualElements.Attribution =
        new UserActivityAttribution(new Uri("https://demoicons.blob.core.windows.net/blobcontainer/Icons/car.png"))
        {
            AlternateText = "Case"
        };
```

4. 4th for saving:

```cs
await _userActivity.SaveAsync();
_userActivitySession?.Dispose();
_userActivitySession = _userActivity.CreateSession();
```

5. 5th to call all this previous code:

```cs
await GenerateUserActivity(selectedCase);
```

6. 6th one for Adaptive Card skeleton:

```cs
var card = new AdaptiveCard
{
    BackgroundImage = new Uri("https://demoicons.blob.core.windows.net/blobcontainer/bg.jpg")
};

// Your code goes here

return card.ToJson();
```

7. 7th for the card generating itself

```cs
var imageColumn = GetImageColumn(selectedCase);
var nameColumn = GetNameColumn(selectedCase);
var addressColumn = GetAddressColumn(selectedCase);
var phoneColumn = GetPhoneColumn(selectedCase);

card.Body.Add(new AdaptiveContainer
{
    Items = new List<AdaptiveElement>
        {
        new AdaptiveColumnSet { Columns = new List<AdaptiveColumn> { imageColumn, nameColumn } },
            new AdaptiveColumnSet { Columns = new List<AdaptiveColumn> { addressColumn } },
            new AdaptiveColumnSet { Columns = new List<AdaptiveColumn> { phoneColumn } }
        }
});
```

8. 8th for the code to create the Adaptive Card

```cs
var adaptiveCard = CreateAdaptiveCardForTimelineAsync(selectedCase);
_userActivity.VisualElements.Content = AdaptiveCardBuilder.CreateAdaptiveCardFromJson(adaptiveCard);
```
# 1 - Graph Explorer

## Graph Explorer

- **Navigate** to https://developer.microsoft.com/en-us/graph/graph-explorer
- Show quickly some of the **Getting Started** samples such as **my profile**, **my photo**, **all the items in my drive**
- Show there's more by clicking on the blue **show more samples** link
- Enable **Outlook Calendar (6)**, **Outlook Mail (10)** and **People (3)**
- On the left panel, scroll down to **Outlook Calendar** and click on **my events for the next week**
- Show briefly the corresponding URL used and the JSON returned
- In the **Outlook Calendar** section, the **POST schedule a meeting** shows we can also write to the graph on behalf of the user

## Web Application

- Switch to the **Dashboard Web App**. Explain that it looks at your calendar
- Press the secret **key 'a'**
- Show you've just got a 3 hours budget meeting scheduled. 
- Press the secret **key 's'**
- When a meeting longer than 1h30 has been identified, it will take the next available timeslot on the calendar to schedule a relaxation moment.
- Go back to **Visual Studio** in the **demo-app** project inside the **graphHelper.js** file
- **Copy paste the getUserData function** just after *TODO: Add People Data here*. Rename the function **getPeopleData**. We now need to update this function with the URL from Graph Explorer to get people data.
- Go back to the **Graph Explorer website**, to the **People** section and choose **people I work with**
- Copy the URL available at the top of the window. It should be *https://graph.microsoft.com/v1.0/me/people*
- **Paste** it in into the **getPeopleData** function instead of the current URL used. It will get the person you're working with the most. It'll be the first person at the top of the JSON data returned.
- We need to setup a little bit of UI. **Go to index.js** file and **uncomment the code** from line 129 to 149. 
- **Save** the changes and go back to the browser to **refresh the web app**
- We still have the same relaxation timeslot in the agenda with an **additional icon on its right**.
- **Click on the icon**, it will display an invitation UI

# 2 - Adaptive Cards

- Open MS Edge and navigate to **http://adaptivecards.io/visualizer**
- Locate the **"type": "Image"** item 
- Change the **size** property from **small** to **medium** 
- Just below, change the **TextBlock text property** from **Matt Hidinger** to your own name
- Show the various available rendering template in the **Select Host App** drop-down list
- Switch to **Cortana Skills** then to **Windows Timeline** and through all available types. Just precise some are interactive, some are not.

# 3 - Timeline

- Go to the **second instance** of **Visual Studio** containing the **ContosoInsurance** solution
- **Launch** the application pressing F5 in Visual Studio
- While it's launching, **open the Windows Timeline** 
- Clear previous entry by right-clicking an item and select **Clear all from Earlier Today**
- In the launched app, navigate to **Cases** and select the first item, press the back button and select a couple of others like that
- **Show your Timeline**: nothing new should be logged so far
- Go back to **Visual Studio** and stop the app
- In the **GenerateUserActivity** method, use the **5 first code snippets** in the TODO section and explain what each snippet does
- Inside the **OnNavigatedTo** method, insert at the end of the method the **snippet 6** to call the previous code
- **Launch** the new app
- Go through the same flow as before, opening the **Cases** and navigating back and forth on various items
- **Open your Windows Timeline** and you should now see the various cases you've navigated to in it
- Click on **one of the cases** in the **Timeline**. It will navigate directly to this case in the UWP app.
- Now let's make it an Adaptive card. 
- **Uncomment the helpers code** available at the end of the **CasePage.xaml.cs**
- At the beginning, add this using: **using AdaptiveCards;**
- Now go to the **CreateAdaptiveCardForTimelineAsync** method
- **Remove the line** of code inside it
- **Insert the 6th code snippet** which is the skeleton of the new method
- In the **TODO** section, insert the **7th code snippet** which is the card code generation
- Go back to the **GenerateUserActivity** method
- Insert the **8th code snippet** just **before the SaveAsync()** call
- Launch this new app
- Again, go through the same flow as before, opening the **Cases** and navigating back and forth on various items
- **Open your Windows Timeline** and you should now see the various cases you've navigated to with now an adaptative card layout

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.