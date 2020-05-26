using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FoodAPI.Models.FoodModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FoodAPI.Installers
{
    public class DbInstaller : IInstallable
    {
        public void InstallServices(IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
            //var connectionString = configuration.GetConnectionString("FoodDBConnection");
            services.AddEntityFrameworkNpgsql().AddDbContext<fooddbContext>(opt =>
                opt.UseNpgsql(connectionString));
        }
    }
}
