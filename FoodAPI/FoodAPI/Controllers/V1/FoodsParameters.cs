using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FoodAPI.Controllers.V1
{
    public class FoodsParameters : QueryStringParameters
    {
        public double MinProtein { get; set; }
    }
}
