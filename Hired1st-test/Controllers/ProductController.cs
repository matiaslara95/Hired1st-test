using AutoMapper;
using Hired1stTest.Entity.DTO;
using Hired1stTest.Entity.Models;
using Hired1stTest.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Hired1stTest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private IProductRepository _productRepository;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public ProductController(IProductRepository productRepository, IMapper mapper, UserManager<User> userManager)
        {
            _productRepository = productRepository;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateProduct(ProductForManage newProduct)
        {
            Product product = null;

            if (newProduct == null)
                return BadRequest();

            try
            {
                User? user = await _userManager.FindByIdAsync(newProduct.UserId);
                if (user != null)
                {
                    product = _mapper.Map<Product>(newProduct);
                    product.User = user;
                    var result = await _productRepository.CreateProduct(product);
                    if (!result)
                    {
                        return BadRequest();
                        //return BadRequest(new RegistrationResponse { Errors = errors });
                    }
                    product.User = null;
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return Ok(StatusCode(200, product));
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> ListProductsByUser(string idUser)
        {
            List<ProductForManage> result = new List<ProductForManage>();

            List<Product> products = await _productRepository.GetProductsByUser(idUser);
            if (products.Count > 0)
            {
                result = _mapper.Map<List<ProductForManage>>(products);
                result.ForEach(product => { product.UserId = products.Where(x => x.Id == product.Id).FirstOrDefault().User.Id; }) ;
            }

            return new JsonResult(result, new JsonSerializerOptions { PropertyNamingPolicy = null });
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateProduct(ProductForManage oldProduct)
        {
            try
            {
                if (oldProduct != null)
                {
                    Product product = await _productRepository.GetProductById(oldProduct.Id);
                    if (product != null)
                    {
                        product.Name = oldProduct.Name;
                        product.Price = oldProduct.Price;
                        product.Description = oldProduct.Description;

                        bool result = await _productRepository.UpdateProduct(product);
                        if (!result)
                        {
                            return BadRequest();
                            //return BadRequest(new RegistrationResponse { Errors = errors });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return Ok(StatusCode(200));
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteProduct(ProductForDelete oldProduct)
        {
            try
            {
                if (oldProduct != null)
                {
                    Product product = await _productRepository.GetProductById(oldProduct.Id);
                    if (product != null)
                    {
                        bool result = await _productRepository.DeleteProduct(product.Id);
                        if (!result)
                        {
                            return BadRequest();
                            //return BadRequest(new RegistrationResponse { Errors = errors });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return Ok(StatusCode(200));
        }
    }
}
