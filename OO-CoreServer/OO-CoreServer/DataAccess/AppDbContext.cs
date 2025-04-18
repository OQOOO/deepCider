using Microsoft.EntityFrameworkCore;
using OO_CoreServer.DataAccess.Entities;

namespace OO_CoreServer.DataAccess
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }  // 예시 엔터티
    }
}