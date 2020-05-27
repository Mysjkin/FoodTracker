using FoodAPI.Models.FoodModels;
using FoodAPI.V1.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace FoodAPI.Controllers.V1
{
    public class FoodsRepository
    {
        readonly fooddbContext context_;

        public FoodsRepository(fooddbContext context)
        {
            context_ = context;
        }

        public async Task<List<Foods>> GetPagedFoods(FoodsParameters foodsParameters)
        {
            var foodsTask = context_.Foods
                .OrderBy(f => f.NameDk)
                .Skip((foodsParameters.PageNumber - 1) * foodsParameters.PageSize)
                .Take(foodsParameters.PageSize)
                .ToListAsync();

            return await foodsTask;
        }

        /* A get on food name returns a list of SearchFood types since this
           method is used in the search api call.
           
           Input: A food name.
           Output: A list of SearchFood instances.
        */
        public async Task<List<SearchFood>> GetFoodsByName(FoodsParameters foodsParameters)
        {
            string name = foodsParameters.Name;
            if (string.IsNullOrWhiteSpace(name))
            {
                return new List<SearchFood>();
            }
            var foodsTask = context_.Foods
                        .Where(o => o.NameDk
                            .ToLower()
                            .Contains(name.Trim().ToLower()))
                        .OrderBy(f => f.NameDk)
                        .Skip((foodsParameters.PageNumber - 1) * foodsParameters.PageSize)
                        .Take(foodsParameters.PageSize)
                        .ToListAsync();

            List<SearchFood> sfs = new List<SearchFood>();
            var foods = await foodsTask;
            foreach (var f in foods)
            {
                SearchFood sf = new SearchFood();
                sf.Id = f.Id;
                sf.NameDk = f.NameDk;

                List<Macronutrients> macros = await context_.Macronutrients.Where(o => o.FoodId == f.NameHash).ToListAsync();

                sf.Kcal = macros.Where(o => o.Name.ToLower().Contains("kcal")).Select(o => o.Value).FirstOrDefault();
                sf.Protein = macros.Where(o => o.Name.ToLower().Contains("protein, deklaration")).Select(o => o.Value).FirstOrDefault();
                sf.Carbs = macros.Where(o => o.Name.ToLower().Contains("kulhydrat, tilgængelig, deklaration")).Select(o => o.Value).FirstOrDefault();
                sf.Fat = macros.Where(o => o.Name.ToLower().Contains("fedt, total")).Select(o => o.Value).FirstOrDefault();

                sfs.Add(sf);
            }
            return sfs;
        }

        /* A get on food id returns a CompleteFood type which includes all
            information about the food.
           
           Input: A food id.
           Output: An instance of the CompleteFood viewmodel.
        */
        public async Task<CompleteFood> GetFoodById(int id)
        {
            Task<Foods> foodTask = context_.Foods.Where(o => o.Id == id).Select(o => o).FirstOrDefaultAsync();
            var food = await foodTask;
            int foodHash = food.NameHash;

            Task<List<AminoAcids>> aminoAcidsTask = context_.AminoAcids.Where(o => o.FoodId == foodHash).ToListAsync();

            Task<List <Carbohydrates>> carbohydratesTask = context_.Carbohydrates.Where(o => o.FoodId == foodHash).ToListAsync();

            Task<List <FattyAcidsSums>> fattyAcidsSumsTask = context_.FattyAcidsSums.Where(o => o.FoodId == foodHash).ToListAsync();

            Task<List <Macronutrients>> macronutrientsTask = context_.Macronutrients.Where(o => o.FoodId == foodHash).ToListAsync();

            Task<List <MineralsAndInorganic>> mineralsAndInorganicTask = context_.MineralsAndInorganic.Where(o => o.FoodId == foodHash).ToListAsync();

            Task<List <OrganicAcids>> organicAcidsTask = context_.OrganicAcids.Where(o => o.FoodId == foodHash).ToListAsync();

            Task<List <Sterols>> sterolsTask = context_.Sterols.Where(o => o.FoodId == foodHash).ToListAsync();

            Task<List <Vitamins>> vitaminsTask = context_.Vitamins.Where(o => o.FoodId == foodHash).ToListAsync();

            CompleteFood cf = new CompleteFood();
            cf.Food = food;
            cf.AminoAcids = await aminoAcidsTask;
            cf.Carbohydrates = await carbohydratesTask;
            cf.FattyAcids = await fattyAcidsSumsTask;
            cf.Macros = await macronutrientsTask;
            cf.Minerals = await mineralsAndInorganicTask;
            cf.Sterols = await sterolsTask;
            cf.Vitamins = await vitaminsTask;

            return cf;
        }

        public List<CompleteFood> GetCompleteFoods(FoodsParameters foodsParameters)
        {
            var foods = FilteredFoods(foodsParameters);
            return foods;
        }

        public List<CompleteFood> FilteredFoods(FoodsParameters foodsParameters)
        {
            double minProtein = foodsParameters.MinProtein;
            bool validProtein = minProtein > 0 && minProtein <= 100;
            if (!validProtein)
            {
                return new List<CompleteFood>();
            }
            var filteredFoods = context_.Macronutrients.Where(f => f.Name.ToLower().Contains("protein, deklaration") && f.Value >= minProtein);
            var foods = (from f in context_.Foods
                         join e in filteredFoods
                         on f.NameHash equals e.FoodId
                         select new
                         {
                             Food = f,
                         }).ToList();

            List<CompleteFood> cfs = new List<CompleteFood>();
            foreach (var f in foods)
            {
                CompleteFood cf = new CompleteFood();
                cf.Id = f.Food.Id;
                cf.NameDk = f.Food.NameDk;
                cf.Food = f.Food;
                cf.Macros = context_.Macronutrients.Where(o => o.FoodId == cf.Food.NameHash).ToList();
                cfs.Add(cf);
            }

            return cfs;
        }
    }
}
