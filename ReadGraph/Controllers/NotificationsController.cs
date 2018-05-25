using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.NotificationHubs;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace DemoApp.Controllers
{
    [Route("api/notifications")]
    public class NotificationController : Controller
    {
        public const string NotificationTemplate = "<toast><visual><binding template=\"ToastGeneric\"><text hint-maxLines=\"1\">You are sending lots of emails!</text><text>Here, have a goat picture!</text><image placement=\"\" src=\"https://goatdemo.azurewebsites.net/images/goat-notification.png\"/></binding></visual></toast>";

        private readonly string HubConnectionString;
        private readonly string HubName;

        public NotificationController(IConfiguration config)
        {
            this.HubConnectionString = config["Notifications:HubConnectionString"];
            this.HubName = config["Notifications:HubName"];
        }

        [HttpPost("listen_graph")]
        public ActionResult Listen([FromQuery]string validationToken)
        {
            // Validate the new subscription by sending the token back to Microsoft Graph.
            // This response is required for each subscription.
            if (validationToken != null)
            {
                return Content(validationToken, "plain/text");
            }
            else
            {
                // Parse the received notifications
                try
                {
                    var notifications = new Dictionary<string, Notification>();
                    using (var inputStream = new System.IO.StreamReader(Request.Body))
                    {
                        JObject jsonObject = JObject.Parse(inputStream.ReadToEnd());
                        if (jsonObject != null)
                        {
                            // Notifications are sent in a 'value' array. The array might contain multiple notifications for events that are
                            // registered for the same notification endpoint, and that occur within a short timespan.
                            JArray value = JArray.Parse(jsonObject["value"].ToString());
                            foreach (var notification in value)
                            {
                                Notification current = JsonConvert.DeserializeObject<Notification>(notification.ToString());

                                // Send Push Notification
                                var hub = NotificationHubClient.CreateClientFromConnectionString(HubConnectionString, HubName);
                                hub.SendWindowsNativeNotificationAsync(NotificationTemplate, current.ClientState);
                            }
                        }
                    }
                }
                catch (Exception)
                {
                    // TODO: Handle the exception.
                    // Still return a 202 so the service doesn't resend the notification.
                }

                return this.Accepted();
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult> RegisterDeviceAsync([FromBody]DeviceRegistration registration)
        {
            var hub = NotificationHubClient.CreateClientFromConnectionString(HubConnectionString, HubName);
            var alreadyRegistered = (await hub.GetRegistrationsByTagAsync(registration.DeviceId, 10))
                .Where(r => r is WindowsRegistrationDescription)
                .Select(r => (WindowsRegistrationDescription)r)
                .Any(o => o.ChannelUri.ToString() == registration.ChannelUri);

            if (!alreadyRegistered)
            {
                var registrationResponse = await hub.CreateWindowsNativeRegistrationAsync(registration.ChannelUri, new string[] { registration.DeviceId });
            }

            return this.Accepted();
        }
    }
}
