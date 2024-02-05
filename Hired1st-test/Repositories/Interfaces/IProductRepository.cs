using Hired1stTest.Entity.Models;

namespace Hired1stTest.Repositories.Interfaces
{
    public interface IProductRepository
    {
        public Task<bool> CreateProduct(Product product);
        public Task<List<Product>> GetProductsByUser(string idUser);
        public Task<Product> GetProductById(int idProduct);
        public Task<bool> UpdateProduct(Product product);
        public Task<bool> DeleteProduct(int idProduct);
    }
}
