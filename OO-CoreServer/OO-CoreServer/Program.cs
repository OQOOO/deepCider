using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OO_CoreServer.DataAccess;
using OO_CoreServer.DataAccess.Seeding;
using OO_CoreServer.Services;
using OO_CoreServer.Services.Clients;
using System;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// CORS ��å ����
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()  // ��� �������� ���
            .AllowAnyMethod()     // ��� HTTP �޼��� ���
            .AllowAnyHeader();    // ��� ��� ���
    });
});

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();

// custom services
builder.Services.AddTransient<LocalLLMApiClient>();
builder.Services.AddTransient<ImageApiClient>();
builder.Services.AddTransient<OpenAiApiClient>();

builder.Services.AddSingleton<ServiceStatus>();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = "yourapp",
            ValidAudience = "yourapp",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("dev_secret_key_for_testing_1234567890!!"))
        };
    });


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    DbInitializer.Seed(dbContext);

    // migration commend line:
    // dotnet ef migrations add example
}

app.UseAuthentication();
app.UseAuthorization();


app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

// �� ������ ���� ȯ�濡���� Swagger UI�� Ȱ��ȭ
app.UseSwagger();
app.UseSwaggerUI();

//app.UseHttpsRedirection();

//app.UseAuthorization();

app.MapControllers();

app.Run();
