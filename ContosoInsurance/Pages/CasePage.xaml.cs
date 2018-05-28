// ******************************************************************
// Copyright (c) Microsoft. All rights reserved.
// This code is licensed under the MIT License (MIT).
// THE CODE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
// THE CODE OR THE USE OR OTHER DEALINGS IN THE CODE.
// ******************************************************************

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ContosoInsurance.Models;
using Windows.ApplicationModel.UserActivities;
using Windows.UI.Shell;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Navigation;
//using AdaptiveCards;

namespace ContosoInsurance.Pages
{
    public sealed partial class CasePage : Page
    {
        private UserActivityChannel _userActivityChannel;
        private UserActivity _userActivity;
        private UserActivitySession _userActivitySession;

        public CasePage()
        {
            InitializeComponent();
        }

        public Case Case { get; set; }

        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            var selectedCase = e.Parameter as Case;
            Case = selectedCase;
            Bindings.Update();

            //await GenerateUserActivity(selectedCase);
        }

        private void OnBackButtonClick(object sender, RoutedEventArgs e)
        {
            if (Frame.CanGoBack)
            {
                Frame.GoBack();
            }
        }

        private static string CreateAdaptiveCardForTimelineAsync(Case selectedCase)
        {
            throw new NotImplementedException();

            //var card = new AdaptiveCard
            //{
            //    BackgroundImage = new Uri("https://demoicons.blob.core.windows.net/blobcontainer/bg.jpg")
            //};

            //var imageColumn = GetImageColumn(selectedCase);
            //var nameColumn = GetNameColumn(selectedCase);
            //var addressColumn = GetAddressColumn(selectedCase);
            //var phoneColumn = GetPhoneColumn(selectedCase);

            //card.Body.Add(new AdaptiveContainer
            //{
            //    Items = new List<AdaptiveElement>
            //    {
            //        new AdaptiveColumnSet { Columns = new List<AdaptiveColumn> { imageColumn, nameColumn } },
            //        new AdaptiveColumnSet { Columns = new List<AdaptiveColumn> { addressColumn } },
            //        new AdaptiveColumnSet { Columns = new List<AdaptiveColumn> { phoneColumn } }
            //    }
            //});

            //return card.ToJson();
        }

        private async Task GenerateUserActivity(Case selectedCase)
        {
            // Inform the user that the activity is being saved
            await Task.Delay(500);
            MessagePanel.Visibility = Visibility.Visible;
            MessageText.Text = "Saving case to Windows Timeline...";

            // Generate User Activity
            //_userActivityChannel = UserActivityChannel.GetDefault();
            //_userActivity = await _userActivityChannel.GetOrCreateUserActivityAsync($"Case {selectedCase.Id}");

            // Deep linking
            //_userActivity.ActivationUri = new Uri($"contoso-insurance://case?{selectedCase.Id}");
            //_userActivity.VisualElements.DisplayText = $"Case {selectedCase.Id}";

            // Basic activity visual
            //_userActivity.VisualElements.Description = $"Opened by {selectedCase.FullName}";
            //_userActivity.VisualElements.Attribution =
            //    new UserActivityAttribution(new Uri("https://demoicons.blob.core.windows.net/blobcontainer/Icons/car.png"))
            //    {
            //        AlternateText = "Case"
            //    };

            // Add adaptive card layout
            //var adaptiveCard = CreateAdaptiveCardForTimelineAsync(selectedCase);
            //_userActivity.VisualElements.Content = AdaptiveCardBuilder.CreateAdaptiveCardFromJson(adaptiveCard);

            // Save to Timeline and dispose
            //await _userActivity.SaveAsync();
            //_userActivitySession?.Dispose();
            //_userActivitySession = _userActivity.CreateSession();

            // Inform the user the activity has been saved
            await Task.Delay(3000);
            MessageText.Text = "Done and you are good to go!";
            await Task.Delay(2000);
            MessagePanel.Visibility = Visibility.Collapsed;
        }

        //private static AdaptiveColumn GetImageColumn(Case selectedCase)
        //{
        //    return new AdaptiveColumn
        //    {
        //        Width = AdaptiveColumnWidth.Auto,
        //        Items = new List<AdaptiveElement>
        //        {
        //            new AdaptiveImage
        //            {
        //                Url = new Uri("https://pbs.twimg.com/profile_images/910829310369423360/HebqTkCW_400x400.jpg"),
        //                Size = AdaptiveImageSize.Small,
        //                Style = AdaptiveImageStyle.Person
        //            }
        //        }
        //    };
        //}

        //private static AdaptiveColumn GetNameColumn(Case selectedCase)
        //{
        //    return new AdaptiveColumn
        //    {
        //        Width = AdaptiveColumnWidth.Stretch,
        //        Items = new List<AdaptiveElement>
        //        {
        //            new AdaptiveTextBlock
        //            {
        //                Text = selectedCase.FullName,
        //                Weight = AdaptiveTextWeight.Bolder
        //            },
        //            new AdaptiveTextBlock
        //            {
        //                Text = selectedCase.Id,
        //                IsSubtle = true,
        //                Spacing = AdaptiveSpacing.None,
        //                Weight = AdaptiveTextWeight.Bolder
        //            }
        //        }
        //    };
        //}

        //private static AdaptiveColumn GetAddressColumn(Case selectedCase)
        //{
        //    return new AdaptiveColumn
        //    {
        //        Width = AdaptiveColumnWidth.Auto,
        //        Items = new List<AdaptiveElement>
        //        {
        //            new AdaptiveTextBlock
        //            {
        //                Text = $"{selectedCase.Address1}, {selectedCase.Address2}"
        //            }
        //        }
        //    };
        //}

        //private static AdaptiveColumn GetPhoneColumn(Case selectedCase)
        //{
        //    return new AdaptiveColumn
        //    {
        //        Width = AdaptiveColumnWidth.Auto,
        //        Items = new List<AdaptiveElement>
        //        {
        //            new AdaptiveTextBlock
        //            {
        //                Text = selectedCase.Phone
        //            }
        //        }
        //    };
        //}
    }
}