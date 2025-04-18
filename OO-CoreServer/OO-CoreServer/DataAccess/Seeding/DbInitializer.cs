using Microsoft.EntityFrameworkCore;
using OO_CoreServer.DataAccess.Entities;

namespace OO_CoreServer.DataAccess.Seeding
{
    public class DbInitializer
    {
        public DbInitializer() { }

        public static void Seed(AppDbContext context)
        {
            context.Database.EnsureDeleted(); // DB의 내용 완전 삭제(개발 편의용)
            context.Database.Migrate();

            if (!context.Users.Any(u => u.role == "admin"))
            {
                var admin = new User
                {
                    Id = "admin",
                    Username = "admin",
                    Password = "admin123",
                    role = "admin"
                };
                context.Users.Add(admin);
                context.SaveChanges();
            }
        }
    }
}
