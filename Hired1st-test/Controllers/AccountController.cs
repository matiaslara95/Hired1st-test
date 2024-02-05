using AutoMapper;
using Hired1stTest.JwtFeatures;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace Hired1stTest.Controllers
{
    [Route("api/accounts")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ILogger<AccountController> _logger;
        private readonly IMapper _mapper;
        private readonly JwtHandler _jwtHandler;

        public AccountController(
                                ILogger<AccountController> logger,
                                IMapper mapper,
                                JwtHandler jwtHandler
                                )
        {
            _logger = logger;
            _mapper = mapper;
            _jwtHandler = jwtHandler;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserForAuthentication userForAuthentication)
        {
            var user = await _userManager.FindByNameAsync(userForAuthentication.Email);
            if (user == null
                || !await _userManager.CheckPasswordAsync(user, userForAuthentication.Password))
                return Unauthorized(new AuthResponse { ErrorMessage = "Invalid Authentication" });
            var isTfaEnabled = await _userManager.GetTwoFactorEnabledAsync(user);
            if (!isTfaEnabled)
            {
                var signingCredentials = _jwtHandler.GetSigningCredentials();
                var claims = _jwtHandler.GetClaims(user);
                var tokenOptions = _jwtHandler.GenerateTokenOptions(signingCredentials, claims);
                var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
                return Ok(new AuthResponse { IsAuthSuccessful = true, IsTfaEnabled = false, Token = token });
            }
            return Ok(new AuthResponse { IsAuthSuccessful = true, IsTfaEnabled = true });
        }

        [HttpPost]
        public IActionResult Logout()
        {
            return null;
        }
    }
}
