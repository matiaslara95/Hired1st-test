using System.ComponentModel.DataAnnotations;

namespace Hired1stTest.Entity.DTO
{
    public class UserForManage
    {
        public string? Id { get; set; }
        [Required]
        public string? FirstName { get; set; }
        [Required]
        public string? LastName { get; set; }
        [Required(ErrorMessage = "Email is required.")]//, RegularExpression("[^@ \\t\\r\\n]+@[^@ \\t\\r\\n]+\\.[^@ \\t\\r\\n]+\r\n", ErrorMessage = "Format incorrect")
        public string? Email { get; set; }

        //[Required(ErrorMessage = "Password is required")]
        //public string? Password { get; set; }
        //public string? ConfirmPassword { get; set; }
        public string PhoneNumber { get; set; }         
    }
}
