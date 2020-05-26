using FoodAPI.Models.FoodModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FoodAPI.V1.ViewModels
{
    public class CompleteFood
    {
        public int Id { get; set; }
        public string NameDk { get; set; }

        public Foods Food { get; set; }

        public List<Macronutrients> Macros { get; set; }

        public List<AminoAcids> AminoAcids { get; set; }

        public List<Carbohydrates> Carbohydrates { get; set; }

        public List<FattyAcidsSums> FattyAcids { get; set; }

        public List<MineralsAndInorganic> Minerals { get; set; }

        public List<OrganicAcids> OrganicAcids { get; set; }

        public List<Vitamins> Vitamins { get; set; }

        public List<Sterols> Sterols { get; set; }
    }
}
