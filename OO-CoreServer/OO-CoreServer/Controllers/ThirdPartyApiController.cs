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

        
    }
}