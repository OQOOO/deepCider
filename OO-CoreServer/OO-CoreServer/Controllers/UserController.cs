using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OO_CoreServer.DataAccess;
using OO_CoreServer.DataAccess.Entities;
using OO_CoreServer.DTOs;

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
        public IActionResult Login()
        {
            return null;
        }

        [HttpPost("/signUp")]
        public IActionResult SignUp([FromBody] SignUpDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("request data is NULL");
            }

            // id 검사 진행 구현할것
            //

            var user = new User
            {
                Id = dto.Id,
                Username = dto.Username,
                Password = dto.Password,
                role = "user",
            };
            _appDbContext.Users.Add(user);
            _appDbContext.SaveChanges();



            return Ok("연결 성공");
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
