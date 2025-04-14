using Microsoft.EntityFrameworkCore;

namespace OO_CoreServer.Services
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }  // 예시 엔터티
    }
}

public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
}