using Hired1stTest.Entity;
using Hired1stTest.Entity.Models;
using Hired1stTest.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace Hired1stTest.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly Hired1stTestContext _context;
        private readonly ILogger<ProductRepository> _logger;

        public ProductRepository(Hired1stTestContext context, ILogger<ProductRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public ProductRepository(Hired1stTestContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<bool> CreateProduct(Product product)
        {
            int result = 0;
            try
            {
                _context.Add<Product>(product);
                result = await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return result > 0;
        }

        public async Task<List<Product>> GetProductsByUser(string idUser) =>
                                    _context.Product.Where(x => x.User.Id == idUser)
                                                    .Select(product => new Product()
                                                    {
                                                        Id = product.Id,
                                                        Name = product.Name,
                                                        Price = product.Price,
                                                        Description = product.Description,
                                                        User = product.User,
                                                    }).ToList();

        public async Task<Product> GetProductById(int idProduct) => _context.Product.Where(x => x.Id == idProduct).FirstOrDefault();

        public async Task<bool> UpdateProduct(Product product)
        {
            int result = 0;
            try
            {
                _context.Update<Product>(product);
                result = await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return result > 0;
        }

        public async Task<bool> DeleteProduct(int idProduct)
        {
            int result = 0;
            try
            {
                Product product = await GetProductById(idProduct);
                _context.Remove<Product>(product);
                result = await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return result > 0;
        }
    }
}
