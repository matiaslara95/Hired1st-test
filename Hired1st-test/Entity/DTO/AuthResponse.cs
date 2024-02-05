namespace Hired1stTest.Entity.DTO
{
    public class AuthResponse
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool IsAuthSuccessful { get; set; }
        public bool IsTfaEnabled { get; set; }
        public string? ErrorMessage { get; set; }
        public string? Token { get; set; }
    }
}
