namespace Hired1stTest.Entity.DTO
{
    public class ProductResponse
    {
        public bool IsSuccessfulRegistration { get; set; }
        public IEnumerable<string>? Errors { get; set; }
    }
}
