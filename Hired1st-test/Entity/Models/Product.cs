using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Hired1stTest.Entity.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public User User { get; set; }
    }
}
