using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OO_CoreServer.DTOs;
using System;
using System.IO;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;
using System.Net.Http;
using OO_CoreServer.Services;
using Microsoft.EntityFrameworkCore;
using OO_CoreServer.DataAccess;
using OO_CoreServer.DataAccess.Entities;

namespace OO_CoreServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThirdPartyApiController : ControllerBase
    {
        private readonly AppDbContext _context;
        private OpenApiClient _openApiClient;

        public ThirdPartyApiController(OpenApiClient openApiClient, AppDbContext context)
        {
            _openApiClient = openApiClient;
            _context = context;
        }

        [HttpGet("/test")]
        public string Test()
        {
            return "test";
        }

        [HttpPost("/tApi/openAI")]
        public async Task sendMessage([FromBody] MessageDTO dto)
        {
            string message = dto.Message;
            Response.ContentType = "text/event-stream";

            await foreach (var chunk in _openApiClient.SendPromptAndStreamResponse(dto.Message))
            {
                await Response.WriteAsync(chunk);
                await Response.Body.FlushAsync(); // 강제로 데이터를 클라이언트로 밀어냄
            }
        }

        // Test

        [HttpPost("DBTestInput")]
        public ActionResult<User> CreateUser([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest("Invalid user data.");
            }

            _context.Users.Add(user); // 새로운 사용자 추가
            _context.SaveChanges(); // 변경 사항 저장

            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user); // 새로 생성된 리소스를 반환
        }
        [HttpGet("DBTestOutput")]
        public ActionResult<IEnumerable<User>> GetUsers()
        {
            var users = _context.Users.ToList(); // Users 테이블에서 모든 데이터 가져오기
            return Ok(users); // 데이터를 HTTP 200 OK 상태와 함께 반환
        }
    }
}