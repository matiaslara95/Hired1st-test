using System.ComponentModel.DataAnnotations;

namespace Hired1stTest.Entity.DTO
{
    public class ProductForManage
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string UserId { get; set; }
    }
}
