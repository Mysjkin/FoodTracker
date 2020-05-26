using System;
using System.Collections.Generic;

namespace FoodAPI.Models.FoodModels
{
    public partial class Foods
    {
        public int Id { get; set; }
        public int NameHash { get; set; }
        public string NameDk { get; set; }
        public string NameEng { get; set; }
    }
}
