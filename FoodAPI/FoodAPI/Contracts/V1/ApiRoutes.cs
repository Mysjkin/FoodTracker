﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FoodAPI.Contracts.V1
{
    public static class ApiRoutes
    {
        public const string Root = "api";
        public const string Version = "v1";
        public const string Base = Root+"/"+Version;
        public static class Foods
        {
            public const string GetFoods = Base + "/" + "foods";
            public const string Test = Base + "/" + "test";
            public const string GetFoodById = Base + "/" + "foods" + "/" + "{id}";
            public const string SearchByName = Base + "/" + "foods" + "/" + "search";
        }
    }
}
