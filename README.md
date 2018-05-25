
# Build 2018: Getting Started with Windows Timeline and User Activities
  
This lab will introduce you to the new Windows Timeline and show you how your Universal Windows Platform apps can extend this feature by writing User Activities. The Timeline provides users with a rich history of their activity across devices. By writing User Activities, apps can help users get back to specific points - i.e. things the user was doing - in their app. The lab scenario focuses on *Contoso Insurance*, a fictional insurance company, who provides their employees with a case management app. By the end of the lab, the app will be able to post each case reviewed by the employee to their Timeline for easy access later.

## System Requirements

The Windows Timeline will be available in the next update for Windows 10; however, it can already be used if you are part of the Windows Insider Program ([learn more](https://insider.microsoft.com)). The accompanying Insider SDK is also required along with Visual Studio 2017.

The lab environment has been pre-configured for you with all of the required prerequisites.

## Section 1: Introducing the Windows Timeline

### A) Microsoft Edge

Before starting on the Contoso Insurance app, let's see how existing Windows apps are taking advantage of the Windows Timeline. First, let's look at a modern UWP app: Microsoft Edge.

1. Open **Microsoft Edge** and navigate to `https://www.microsoft.com`.
1. Close the browser.
1. Open **Timeline** by clicking the new timeline icon to the right of the search bar.
1. Find the card for **Microsoft Edge** under **Earlier Today**.

    > Notice how the page title and URL are embedded in the card.

### B) Paint

Next, let's look at a traditional desktop app: Paint. All kinds of Windows apps can take advantage of this new capability.

1. Open **Paint** from the Start menu.
1. Create any simple drawing.
1. Save the drawing to your Documents folder.
1. Close **Paint**.
1. Open **Timeline** by clicking the new timeline icon to the right of the search bar.
1. Find the card for **Paint** under **Earlier Today**.

    > Notice how the background to the card has been customized to show the drawing you created.
1. **Click** on the tile and wait for Paint - and your drawing - to open back up.

## Section 2: Building the Contoso Insurance app

### A) Launch and deploy the solution

1. In the `Desktop\Timeline and activity lab\src` folder, open the `ContosoInsurance.sln` file.
1. When the solution loads, click the run **Local Machine** button to build and launch the app.
3. Play around in the app, and then close it.

## Section 3: Adding user activities

### A) Configure Timeline integration

[User Activities](https://docs.microsoft.com/en-us/uwp/api/windows.applicationmodel.useractivities.useractivity) are created during an app's execution to notify Windows of a user work stream that can be continued on another device or at another time on the same device. **UserActivities** require **VisualElements** which are used to display information about the activity to the user, like display text and description.

We'll construct the minimum required visual elements for a user activity, and then add it to the Timeline.

1. Open **CasePage.xaml.cs** from the **Pages** folder in **Visual Studio**.
1. Where indicated, **add** the following snippet to the `GenerateUserActivity` method to create the activity.

    ```cs
    _userActivityChannel = UserActivityChannel.GetDefault();
    _userActivity = await _userActivityChannel.GetOrCreateUserActivityAsync($"Case {selectedCase.Id}");
    ```
1. **Add** the following snippet to update the new activity with a deep link and text title.

    ```cs
    _userActivity.ActivationUri = new Uri($"contoso-insurance://case?{selectedCase.Id}");
    _userActivity.VisualElements.DisplayText = $"Case {selectedCase.Id}";
    ```

    > We'll look what deep links are and how they work in the next section.
1. **Add** the following snippet to add a description and customize the card's title and icon:

    ```cs
    _userActivity.VisualElements.Description = $"Opened by {selectedCase.FullName}";
    _userActivity.VisualElements.Attribution =
        new UserActivityAttribution(new Uri("https://demoicons.blob.core.windows.net/blobcontainer/Icons/car.png"))
        {
            AlternateText = "Case"
        };
    ```
1. Finalize the activity and clean up the session for the next activity by **adding** the following snippet.

    ```cs
    await _userActivity.SaveAsync();
    _userActivitySession?.Dispose();
    _userActivitySession = _userActivity.CreateSession();
    ```

The existing logic in the `GenerateUserActivity` method notifies the user of the activity being added to the timeline. This is not required to use the Timeline API in your apps.

### B) Write the card to the Timeline

Finally, we'll invoke our code on navigation to ensure that the activity is created each time a user looks at a case.

1. **Add** the following line of code at the bottom of the `OnNavigatedTo` to create a Timeline entry each time a case is opened.

    ```cs
    await GenerateUserActivity(selectedCase);
    ```

### C) Register protocol

Deep links are essential for User Activities as they allow the user to resume the application in the particular state shown by the activity. A **deep link** is a URI that can be passed to an application by Windows to resume the application in a specific state or context. Generally, these are written as [protocol handlers](https://docs.microsoft.com/en-us/windows/uwp/launch-resume/handle-uri-activation) for a scheme (e.g. `my-app://customers?action=new`). UWP apps can register to be a default handler for a URI scheme name. The structure of the rest of the URI is up to the app itself.

In the previous steps, we added an **ActivationUri** for `contoso-insurance://`, but the app currently doesn't support deep links, so we must add support for this protocol.

1. Double click the **Package.appmanifest** file in the Solution Explorer.
1. Navigate to the **Declarations** tab.
1. Select **Protocol** from the **Available declarations** dropdown.
1. Click **Add**.
1. In the **Name** field, enter `contoso-insurance`.
1. Click the **Save** button in the toolbar.

### D) Handle links

Next, we will update our application so that it can handle being activated via the protocol handler we used in the user activity. Our protocol handler will allow the user to open the app to a specific case.

For example, the app will be able to be launched directly into case #1703549 by invoking this URL: `contoso-insurance://case?#1703549`

1. Open **App.xaml.cs**.
1. **Add** the following snippet where indicated to the `OnActivated` method:

    ```cs
    if (args.Kind == ActivationKind.Protocol && args is ProtocolActivatedEventArgs protocolEventArgs)
    {
        // Your next code snippet goes here
    }
    ```

    > The `OnActivated` method will be called every time the app is activated so we must check if it was activated via the protocol by checking the `args` property.
1. **Add** the following snippet to replace the comment in the same method:

    ```cs
    rootFrame.Navigate(typeof(MainPage), Cases.Single(c => c.Id.Equals(protocolEventArgs.Uri.Fragment)));
    ```

    > Here we pull out the `Uri.Fragment` to find the specific case that the app should load. A more mature URL handler would also support other locations within the app.

### E) Build & run

The app code changes are now complete. In this section, we'll debug through this new capability to see it in action.

1. **Add** a breakpoint in **Visual Studio** at the start of the `GenerateUserActivity` method in **CasePage.xaml.cs**.
1. **Add** a breakpoint for the following line in **App.xaml.cs**:

    ```cs
    if (args.Kind == ActivationKind.Protocol && args is ProtocolActivatedEventArgs protocolEventArgs)
    ```
1. Start debugging by clicking the **Local Machine** button in the toolbar.
1. Once the app launches, select the **Cases** page.
1. **Click** on one of the cases.
1. **Wait** for the first breakpoint in `GenerateUserActivity` to be hit.
1. Click **Continue**.
1. Return to **Visual Studio** and click on the **Suspend and shutdown** option in the **Lifecycle Events** toolbar drop down.
1. Open **Timeline** by clicking the new timeline icon to the right of the search bar.
1. Find the **Contoso Insurance** card with the case ID and name listed.
1. Cick on the **Contoso Insurance** card.
1. Notice the **App.xaml.cs** breakpoint gets hit with `args.Kind` of `Protocol`.
1. **Continue** through any remaining breakpoints.
1. **Confirm** the correct case has loaded.

## Section 4: Enhancing User Activities

### A) Getting Started with Adaptive Cards

User Activities can be made even better by providing an [Adaptive Card](https://adaptivecards.io).

1. Open **Microsoft Edge** and navigate to the [Adaptive Cards](http://adaptivecards.io/explorer/) website.

    > The site provides interactive documentation and web-based tools to help build and style your card quickly.
1. Click on **Schema Explorer** in the top nav bar.

    > Each component within the card schema has an example as part of its documentation entry.
1. Click on **Adaptive Card** in the left nav bar.
1. Scroll down and then click on **Try it Yourself**.
1. Update the card title from:

    ```
    Publish Adaptive Card schema
    ```
    to
    ```
    Contoso Insurance
    ```

    and notice the card update in real-time.
1. Change the **Host App** drop down to **Windows Timeline**.

    > The default view is for cards rendered in the Microsoft Bot Framework webchat. We can see how they render on other supported platforms as well. In the case of Windows Timeline, we can see the interactive components are not displayed.

### B) Building Adaptive Cards

In this section, we'll build a card that consists of the customer's name, photo, address, and phone number.

1. Open **Microsoft Edge** and navigate to the [Adaptive Cards visualizer](https://adaptivecards.io/visualizer/index.html?hostApp=Windows%20Timeline).
1. Click **Load from file...**.
1. Open `Desktop\Timeline and activity lab\resources\timeline.json`.

    > Notice that there are a few problems. First, the phone number is truncated due to lack of space. And secondly, the look and feel is basic. It doesn't highlight or arrange information in a way that's helpful to the user. Fortunately, we can use the capabilities of Adaptive Cards to improve the appearance.
1. **Update** the stacked arrangement of photo, name, and ID by moving name and ID so they are alongside the photo by moving:

    ```json
    {
        "type": "Column",
        "width": "auto",
        "items": [
            {
                "type": "TextBlock",
                "text": "Alex Zollinger Chohfi"
            },
            {
                "type": "TextBlock",
                "text": "#1703542"
            }
        ]
    }
    ```
    to the first `ColumnSet` `columns` array:

    ```json
    "columns": [
        {
            "type": "Column",
            "width": "auto",
            "items": [
            {
                "type": "Image",
                "url": "https://pbs.twimg.com/profile_images/910829310369423360/HebqTkCW_400x400.jpg",
                "size": "small"
            }
            ]
        },
        /* Name and ID text blocks go here */
    ]
    ```
1. **Remove** the empty `Container` that used to contain the name and ID.
1. **Update** the `width` of the column that contains the name and ID to `stretch`.
1. **Add** an image style to the `image` item (after the `url` and `size`):

    ```json
    , "style": "person"
    ```

    > This renders the customer's photo in a circular frame (as is typical on many modern websites).
1. **Update** the name to use a bolder font weight by adding the `weight` property (after the `text` property):

    ```json
    , "weight": "bolder"
    ```
1. **Update** the ID to be styled as a sub-header by adding `isSubtle`, `weight`, and `spacing` (after the `text` property):

    ```json
    , "isSubtle": true
    , "weight": "bolder"
    , "spacing": "none"
    ```

### C) Add the Card to your user activity

Now that we've constructed a great looking card, we need to add it to the user activity we previously selected. Instead of using raw JSON, we can use the Adaptive Cards NuGet package to use an object model, which avoids typos and keeps the code much more clean and friendly.

1. Right-click on the **ContosoInsurance (Universal Windows)** project and click on **Manage NuGet Packages.....**.
1. Switch to the **Browse** tab.
1. Enter `AdaptiveCards` in the search box and press enter.
1. Install the **AdaptiveCards** package.
1. Open **Pages** > **CasePage.xaml.cs** and add the following import at the top:

    ```cs
    using AdaptiveCards;
    ```
1. **Uncomment** the four helper methods at the end of this class by **removing** the `/*` at the start of the comment and `*/` at the end.
1. **Add** the following code snippet to **replace** the contents of the `CreateAdaptiveCardForTimelineAsync` method in the **CasePage** class:

    ```cs
    var card = new AdaptiveCard
    {
        BackgroundImage = new Uri("https://demoicons.blob.core.windows.net/blobcontainer/bg.jpg")
    };

    // Your code goes here

    return card.ToJson();
    ```

    > The final output is JSON. This is the format required by the Windows API.
1. Where indicated, **add** the following code snippet to the new method to create elements for the contents of the card.

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

    > Here we've added information about the customer that filed the case (specifically, their photo, name, address, and phone number).
1. **Add** the following code snippet **before** the call to `await _userActivity.SaveAsync()` in the `GenerateUserActivity` method:

    ```cs
    var adaptiveCard = CreateAdaptiveCardForTimelineAsync(selectedCase);
    _userActivity.VisualElements.Content = 	AdaptiveCardBuilder.CreateAdaptiveCardFromJson(adaptiveCard);
    ```
1. **Repeat** the steps in the section **3 E** to run the app and see the improved card in action.
1. **Remove** both breakpoints.

## Section 5: Using Adaptive Cards elsewhere within the app

### A) Render adaptive cards

So far we have used Adaptive Cards as a visual element for User Activities that appear in the Timeline. However, Adaptive Cards can also be used in other places within the app and even across other non-Windows platforms (like bots). In our case, our app has a bot that needs to display simple questions. We can have a shared service generate cards for these questions, and use the Adaptive Card Renderer to render these questions easily and natively on each platform (UWP in this case).

To render these cards in the application we will be using the **AdaptiveCards.Rendering.Uwp** NuGet package. There are similar packages for other platforms including WPF, web (server-side HTML generation), Android, and iOS.

1. Right click on the **ContosoInsurance (Universal Windows)** project and click on **Manage NuGet Packages.....**.
1. Enter `AdaptiveCards.Rendering.Uwp` in the search box and press enter.
1. Install the **AdaptiveCards.Rendering.Uwp** package.
1. Open **NotificationDialog.xaml.cs** under the **Controls** folder in Visual Studio.
1. Add the following import at the top:

    ```cs
    using AdaptiveCards.Rendering.Uwp;
    ```
1. **Add** the renderer as a field at the top of the class.

    ```cs
    private AdaptiveCardRenderer _renderer;
    ```

    > This class allows us to render JSON-based cards as native controls.
1. **Add** the following code to the `InitializeCardRenderer` method to set up the card renderer.

    ```cs
    _renderer = new AdaptiveCardRenderer();
    ```
1. **Uncomment** the code inside the `RenderCardAsync` method at the end of this class by **removing** the `/*` at the start of the comment and `*/` at the end.
1. **Add** code to the `RenderCardAsync` method to convert JSON to an UWP Adaptive Card.

    ```cs
    var result = AdaptiveCard.FromJsonString(card);
    ```
1. **Add** the following snippet where indicated to start rendering.

    ```cs
    var renderResult = _renderer.RenderAdaptiveCard(result.AdaptiveCard);
    renderResult.Action += OnRenderResultAction;
    ```

    > The referenced event handler marks the card as visible after load.
1. **Add** the following snippet next to the rendered card to add it to the visual tree.

    ```cs
    if (renderResult.FrameworkElement is FrameworkElement cardElement)
    {
        cardElement.Loaded += OnCardElementLoaded;
        cardElement.Visibility = Visibility.Collapsed;
        cardElement.Margin = new Thickness(12, 0, 12, 0);

        Implicit.SetAnimations(cardElement, OffsetImplicitAnimations);
        Implicit.SetShowAnimations(cardElement, CardElementShowAnimations);
        Implicit.SetHideAnimations(cardElement, CardElementHideAnimations);

        CardsPanel.Children.Add(cardElement);
    }
    ```

    > The referenced event handler completes the task once a user has clicked on an action button. You'll see how capability this is used in the next section.

### B) Build & run

Now that we're rendering Adaptive Cards sent from our service inside our bot, let's try out the bot and see it working!

1. Build the solution by clicking on **Build > Build Solution...** in the menu bar.
1. Click the **Local Machine** button in the toolbar to start local debugging.
1. After the app starts, you should see a notification at the bottom reporting a new car accident.
1. **Click** the notification.
1. Wait for the dialog to appear with options for the insurance adjuster that can be assigned to the case.
1. **Click** on the bot icon at the bottom to have the bot help you choose the best employee.

    > The bot will now prompt you with questions rendered as **Adaptive Cards** (that we implemented in the previous section).
1. Click **Distance**.
1. Click **Team A**.
1. Click **Charlotte**.
1. Click **Select**.

The case has now been assigned to Charlotte.

### C) Styling the Card host config

Our cards work and look pretty good! However, some of the font sizes used aren't consistent with the font sizes we use within our app. That's where we can use the host config in the Adaptive Card Renderer to ensure that rendered cards match our app's unique style when we display them.

1. **Add** the code to the end of the `InitializeCardRenderer` method to assign our unique host configuration.
    ```cs
    _renderer.HostConfig = new AdaptiveHostConfig
    {
        ContainerStyles =
        {
            Default =
            {
                BackgroundColor = Colors.Azure
            }
        },
        FontSizes =
        {
            Small = 14,
            Default = 16,
            Medium = 18,
            Large = 20,
            ExtraLarge = 24
        }
    };
    ```

    > As you can see, we can provide configuration to the renderer on how to convert the cards to native UWP UX elements. In this case, we override font sizes and background colors.

## Section 6: Watching it all work together

### A) Build & run

Our code changes to add support for the Windows Timeline and Adaptive Cards are now complete. Let's see it in action!

1. Build the solution by clicking on **Build > Build Solution...** in the menu bar.
1. Click the **Local Machine** button in the toolbar to start local debugging.

### B) Adaptive Cards

**Repeat** the steps in section **5 B** to run the app and see the cards within our bot. Notice the slight improvement in the UI consistency of the font sizes.

### C) Timeline

Let's see how the Timeline helps Charlotte manage her caseload.

1. Click on the **profile image** at the bottom left of the app's sidebar to switch to the next profile.
1. You should now see the available cases for Charlotte.
1. Click on the **reload button** at the top right of the cases to refresh the available cases.
1. Click on the new case's **Accept** button.
1. A notification should now appear at the top right of the case stating that the case is _saving to Windows Timeline_.
1. Click on the **Home** menu item to be taken back to the application's home screen.
1. Open **Timeline** by clicking the new timeline icon to the right of the search bar.
1. Scroll down to the `Earlier Today` section where you should see our **Adaptive Card** for the new case.
1. Click on the **card**. This should activate the app via the protocol handler and return you to the specific case page.

## Conclusion

In this lab, you saw how you can take advantage of the new Windows Timeline in your apps to build better experiences for your users. By allowing users to easily pick up their activities later on, no matter what device they're on, they'll save time and spend more time being productive with your application.

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