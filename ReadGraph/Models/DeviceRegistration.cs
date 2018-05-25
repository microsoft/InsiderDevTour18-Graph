using System;
using Newtonsoft.Json;

namespace DemoApp.Controllers
{
    public class DeviceRegistration
    {
        [JsonProperty(PropertyName = "channelUri")]
        public string ChannelUri { get; set; }

        [JsonProperty(PropertyName = "deviceId")]
        public string DeviceId { get; set; }
    }
}