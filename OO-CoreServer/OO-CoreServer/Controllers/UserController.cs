using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OO_CoreServer.DataAccess;
using OO_CoreServer.DataAccess.Entities;
using OO_CoreServer.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace OO_CoreServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private AppDbContext _appDbContext;
        
        public UserController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        // GET: api/<UserController>
        [HttpPost("/login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var user = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Id == dto.Id && u.Password == dto.Password);
            if (user == null)
            {
                return BadRequest("잘못된 계정 정보입니다.");
            }
            
            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token = token,
                user = new { id = user.Id, password = user.Password, role = user.Role }
            });
        }

        [HttpPost("/signUp")]
        public async Task<IActionResult> SignUp([FromBody] SignUpDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("request data is NULL");
            }

            var idCheck = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Id == dto.Id);
            if (idCheck != null)
            {
                return BadRequest("이미 사용중인 아이디입니다.");
            }

            var user = new User
            {
                Id = dto.Id,
                Username = "회원 N",
                Password = dto.Password,
                Role = "user",
            };
            _appDbContext.Users.Add(user);
            _appDbContext.SaveChanges();


            return Ok("회원가입 성공");

        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("dev_secret_key_for_testing_1234567890!!"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "yourapp",
                audience: "yourapp",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }







        // Test

        [HttpPost("DBTestInput")]
        public ActionResult<User> CreateUser([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest("Invalid user data.");
            }

            _appDbContext.Users.Add(user); // 새로운 사용자 추가
            _appDbContext.SaveChanges(); // 변경 사항 저장

            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user); // 새로 생성된 리소스를 반환
        }
        [HttpGet("DBTestOutput")]
        public ActionResult<IEnumerable<User>> GetUsers()
        {
            var users = _appDbContext.Users.ToList(); // Users 테이블에서 모든 데이터 가져오기
            return Ok(users); // 데이터를 HTTP 200 OK 상태와 함께 반환
        }
    }
}
