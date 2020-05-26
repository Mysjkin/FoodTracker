using System;
using System.Collections.Generic;

namespace FoodAPI.Models.FoodModels
{
    public partial class Carbohydrates
    {
        public int Id { get; set; }
        public int FoodId { get; set; }
        public string Name { get; set; }
        public double Value { get; set; }
        public string Unit { get; set; }
    }
}
