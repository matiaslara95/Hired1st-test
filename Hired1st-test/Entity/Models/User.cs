using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Hosting;

namespace Hired1stTest.Entity.Models
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public ICollection<Product> Products { get; }
    }
}
