using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FoodAPI.Options
{
    public class SwaggerOptions
    {
        public string JsonRoute { set; get; }

        public string Description { set; get; }
        
        public string UiEndpoint { set; get; }
    }
}
