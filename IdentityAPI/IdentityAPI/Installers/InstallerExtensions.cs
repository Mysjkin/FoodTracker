using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityAPI.Installers
{
    public static class InstallerExtensions
    {
        public static void InstallServicesInAssembly(this IServiceCollection services, IConfiguration configuration)
        {
            var installers = typeof(Startup).Assembly.ExportedTypes.Where(x =>
                typeof(IInstallable).IsAssignableFrom(x) && !x.IsInterface && !x.IsAbstract).
                Select(Activator.CreateInstance).Cast<IInstallable>().ToList();

            installers.ForEach(i => i.InstallServices(services, configuration));
        }
    }
}
