using System.ComponentModel.DataAnnotations;

namespace Hired1stTest.Entity.DTO
{
    public class UserForDelete
    {
        [Required]
        public string? Id { get; set; }
    }
}
