using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace IdentityAPI.Installers
{
    public class DbInstaller : IInstallable
    {
        public void InstallServices(IServiceCollection services, IConfiguration configuration)
        {
            //var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
            /*var connectionString = configuration.GetConnectionString("DbConnection");
            services.AddEntityFrameworkNpgsql().AddDbContext<fooddbContext>(opt =>
                opt.UseNpgsql(connectionString));*/
                
            services.AddDbContext<IdentityDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DbConnection")));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<IdentityDbContext>()
                .AddDefaultTokenProviders();
        }
    }
}
