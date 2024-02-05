namespace Hired1stTest.Entity.DTO
{
    public class UserResponse
    {
        public bool IsUpdateSuccessful { get; set; }
        public bool IsTfaEnabled { get; set; }
        public string? ErrorMessage { get; set; }
        public string? Token { get; set; }
    }
}
