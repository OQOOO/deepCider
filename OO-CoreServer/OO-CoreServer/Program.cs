using Microsoft.EntityFrameworkCore;
using OO_CoreServer.DataAccess;
using OO_CoreServer.DataAccess.Seeding;
using OO_CoreServer.Services;
using System;

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
builder.Services.AddTransient<ImageApiClientService>();
builder.Services.AddTransient<OpenApiClient>();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    DbInitializer.Seed(dbContext);

    // migration commend line:
    // dotnet ef migrations add example
}

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
