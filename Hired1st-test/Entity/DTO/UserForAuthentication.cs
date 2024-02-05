using System.ComponentModel.DataAnnotations;

namespace Hired1stTest.Entity.DTO
{
    public class UserForAuthentication
    {
        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; }
    }
}
