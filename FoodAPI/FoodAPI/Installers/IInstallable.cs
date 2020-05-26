using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FoodAPI.Installers
{
    public interface IInstallable
    {
        void InstallServices(IServiceCollection services, IConfiguration configuration);
    }
}
