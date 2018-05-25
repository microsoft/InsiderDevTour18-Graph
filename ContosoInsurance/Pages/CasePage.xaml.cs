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
        }

        private async Task GenerateUserActivity(Case selectedCase)
        {
            // Inform the user that the activity is being saved
            await Task.Delay(500);
            MessagePanel.Visibility = Visibility.Visible;
            MessageText.Text = "Saving case to Windows Timeline...";

            // TODO: add time line


            // Inform the user the activity has been saved
            await Task.Delay(3000);
            MessageText.Text = "Done and you are good to go!";
            await Task.Delay(2000);
            MessagePanel.Visibility = Visibility.Collapsed;
        }

        /*private static AdaptiveColumn GetImageColumn(Case selectedCase)
        {
            return new AdaptiveColumn
            {
                Width = AdaptiveColumnWidth.Auto,
                Items = new List<AdaptiveElement>
                {
                    new AdaptiveImage
                    {
                        Url = new Uri("https://pbs.twimg.com/profile_images/910829310369423360/HebqTkCW_400x400.jpg"),
                        Size = AdaptiveImageSize.Small,
                        Style = AdaptiveImageStyle.Person
                    }
                }
            };
        }

        private static AdaptiveColumn GetNameColumn(Case selectedCase)
        {
            return new AdaptiveColumn
            {
                Width = AdaptiveColumnWidth.Stretch,
                Items = new List<AdaptiveElement>
                {
                    new AdaptiveTextBlock
                    {
                        Text = selectedCase.FullName,
                        Weight = AdaptiveTextWeight.Bolder
                    },
                    new AdaptiveTextBlock
                    {
                        Text = selectedCase.Id,
                        IsSubtle = true,
                        Spacing = AdaptiveSpacing.None,
                        Weight = AdaptiveTextWeight.Bolder
                    }
                }
            };
        }

        private static AdaptiveColumn GetAddressColumn(Case selectedCase)
        {
            return new AdaptiveColumn
            {
                Width = AdaptiveColumnWidth.Auto,
                Items = new List<AdaptiveElement>
                {
                    new AdaptiveTextBlock
                    {
                        Text = $"{selectedCase.Address1}, {selectedCase.Address2}"
                    }
                }
            };
        }

        private static AdaptiveColumn GetPhoneColumn(Case selectedCase)
        {
            return new AdaptiveColumn
            {
                Width = AdaptiveColumnWidth.Auto,
                Items = new List<AdaptiveElement>
                {
                    new AdaptiveTextBlock
                    {
                        Text = selectedCase.Phone
                    }
                }
            };
        }*/
    }
}