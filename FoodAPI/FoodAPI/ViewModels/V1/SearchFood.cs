using FoodAPI.Models.FoodModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FoodAPI.V1.ViewModels
{
    public class SearchFood
    {
        public int Id { get; set; }
        public string NameDk { get; set; }
        public double Kcal { get; set; }
        public double Protein { get; set; }
        public double Carbs { get; set; }
        public double Fat { get; set; }
    }
}
