using Microsoft.EntityFrameworkCore;
using ApiJogos.models;

namespace ApiJogos.Data;

public class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {
    }

    public DbSet<JogoEntity> Jogos => Set<JogoEntity>();
}
