using AutoMapper;
using Hired1stTest.Entity.DTO;
using Hired1stTest.Entity.Models;
using Hired1stTest.JwtFeatures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Hired1stTest.Controllers
{
    [Route("api/accounts")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly ILogger<AccountsController> _logger;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly JwtHandler _jwtHandler;

        public AccountsController(
                            ILogger<AccountsController> logger,
                            UserManager<User> UserManager,
                            IMapper mapper,
                            JwtHandler jwtHandler
                            )
        {
            _logger = logger;
            _userManager = UserManager;
            _mapper = mapper;
            _jwtHandler = jwtHandler;
        }

        [HttpPost("registration")]
        public async Task<IActionResult> RegisterUser([FromBody] UserForRegistration userForRegistration)
        {
            IdentityResult result = null;

            if (userForRegistration == null || !ModelState.IsValid)
                return BadRequest();

            var user = _mapper.Map<User>(userForRegistration);
            try
            {
                result = await _userManager.CreateAsync(user, userForRegistration.Password);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description);

                    return Ok(StatusCode(400, BadRequest(new RegistrationResponse { Errors = errors })));
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return Ok(StatusCode(200, user));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserForAuthentication userForAuthentication)
        {
            var user = await _userManager.FindByNameAsync(userForAuthentication.Email);
            if (user == null
                || !await _userManager.CheckPasswordAsync(user, userForAuthentication.Password))
                return Unauthorized(new AuthResponse { ErrorMessage = "Invalid Authentication" });
            var signingCredentials = _jwtHandler.GetSigningCredentials();
            var claims = _jwtHandler.GetClaims(user);
            var tokenOptions = _jwtHandler.GenerateTokenOptions(signingCredentials, claims);
            var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return Ok(new AuthResponse { IsAuthSuccessful = true, IsTfaEnabled = false, Token = token, Id = user.Id, Name = $"{user.FirstName} {user.LastName}" });
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateUser(UserForManage oldUser)
        {
            try
            {
                if (oldUser != null)
                {
                    User user = await _userManager.FindByIdAsync(oldUser.Id);
                    if (user != null)
                    {
                        user.Email = oldUser.Email;
                        user.FirstName = oldUser.FirstName;
                        user.LastName = oldUser.LastName;
                        user.PhoneNumber = oldUser.PhoneNumber;

                        IdentityResult result = await _userManager.UpdateAsync(user);
                        if (!result.Succeeded)
                        {
                            var errors = result.Errors.Select(e => e.Description);

                            return BadRequest(new RegistrationResponse { Errors = errors });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return Ok(StatusCode(200));
        }

        [HttpGet]
        [Authorize]
        public IActionResult ListUsers() => new JsonResult(_mapper.Map<List<UserForManage>>(_userManager.Users),new JsonSerializerOptions { PropertyNamingPolicy = null });

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteUser(UserForDelete oldUser)
        {
            try
            {
                if (oldUser != null)
                {
                    User user = await _userManager.FindByIdAsync(oldUser.Id);
                    if (user != null)
                    {
                        IdentityResult result = await _userManager.DeleteAsync(user);
                        if (!result.Succeeded)
                        {
                            var errors = result.Errors.Select(e => e.Description);

                            return BadRequest(new RegistrationResponse { Errors = errors });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return Ok(StatusCode(200));
        }
    }
}
