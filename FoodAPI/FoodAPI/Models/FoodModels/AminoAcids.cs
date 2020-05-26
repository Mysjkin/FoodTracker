using System;
using System.Collections.Generic;

namespace FoodAPI.Models.FoodModels
{
    public partial class AminoAcids
    {
        public int Id { get; set; }
        public int FoodId { get; set; }
        public string Name { get; set; }
        public int Value { get; set; }
        public double? UnitMgPerGNitrogen { get; set; }
    }
}
