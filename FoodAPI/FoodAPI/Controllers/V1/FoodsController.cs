using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FoodAPI.Models.FoodModels;
using Microsoft.AspNetCore.Mvc;
using FoodAPI.Contracts.V1;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace FoodAPI.Controllers.V1
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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
        public async Task<IActionResult> getFood(int id)
        {
            var food = await foods_.GetFoodById(id);
            return Ok(food);
        }

        [HttpGet(ApiRoutes.Foods.SearchByName)]
        public async Task<IActionResult> getFoodsByName([FromQuery] FoodsParameters foodsParameters)
        {
            var food = await foods_.GetFoodsByName(foodsParameters);
            return Ok(food);
        }

        [HttpGet(ApiRoutes.Foods.GetFoods)]
        public async Task<IActionResult> getFoods([FromQuery] FoodsParameters foodsParameters)
        {
            var foods = await foods_.GetPagedFoods(foodsParameters);
            return Ok(foods);
        }
    }
}
