using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FoodAPI.Models.FoodModels;
using Microsoft.AspNetCore.Mvc;
using FoodAPI.Contracts.V1;

namespace FoodAPI.Controllers.V1
{
    public class FoodsController : Controller
    {
        readonly fooddbContext context_;

        private FoodsRepository foods_;

        public FoodsController(fooddbContext context)
        {
            context_ = context;
            foods_ = new FoodsRepository(context);
        }

        [HttpGet(ApiRoutes.Foods.GetFoodById)]
        public IActionResult getFood(int id)
        {
            return Ok(foods_.GetFoodById(id));
        }

        [HttpGet(ApiRoutes.Foods.SearchByName)]
        public IActionResult getFoodsByName([FromQuery] FoodsParameters foodsParameters)
        {
            return Ok(foods_.GetFoodsByName(foodsParameters));
        }

        [HttpGet(ApiRoutes.Foods.GetFoods)]
        public IActionResult getFoods([FromQuery] FoodsParameters foodsParameters)
        {
            var foods = foods_.GetPagedFoods(foodsParameters);
            return Ok(foods);
        }
    }
}
