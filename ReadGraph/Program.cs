using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace demo_app
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseUrls("http://localhost:5000")           // Remove this for production environments
                .UseIISIntegration()
                .Build();
    }
}
