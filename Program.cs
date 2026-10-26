using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=jogos.db"));

builder.Services.AddCors();

var app = builder.Build();

app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.UseDefaultFiles();
app.UseStaticFiles();


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApiDbContext>();
    db.Database.EnsureCreated();

    if (!db.Jogos.Any())
    {
        db.Jogos.AddRange(
            new JogoEntity { Titulo = "God of War 3", Desenvolvedora = "Santa Monica Studio" },
            new JogoEntity { Titulo = "Red Dead Redemption 2", Desenvolvedora = "Rockstar Games" }
        );
        db.SaveChanges();
    }
}

app.MapGet("/", () => Results.Ok(new { mensagem = "API de Jogos está online! Bem vindo(a)!", status = "OK" }));


app.MapGet("/api/jogos", async (ApiDbContext db) => 
    Results.Ok(await db.Jogos.ToListAsync()));


app.MapGet("/api/jogos/{id:int}", async (int id, ApiDbContext db) =>
{
    var jogo = await db.Jogos.FindAsync(id);
    return jogo is null ? Results.NotFound() : Results.Ok(jogo);
});


app.MapPost("/api/jogos", async (JogoEntradaDto dados, ApiDbContext db) =>
{
    var novoJogo = new JogoEntity
    {
        Titulo = dados.Titulo,
        Desenvolvedora = dados.Desenvolvedora
    };

    db.Jogos.Add(novoJogo);
    await db.SaveChangesAsync();

    return Results.Created($"/api/jogos/{novoJogo.Id}", novoJogo);
});


app.MapPut("/api/jogos/{id:int}", async (int id, JogoEntradaDto dados, ApiDbContext db) =>
{
    var jogo = await db.Jogos.FindAsync(id);
    
    if (jogo is null)
    {
        return Results.NotFound();
    }

    jogo.Titulo = dados.Titulo;
    jogo.Desenvolvedora = dados.Desenvolvedora;

    await db.SaveChangesAsync();
    
    return Results.Ok(jogo);
});


app.MapDelete("/api/jogos/{id:int}", async (int id, ApiDbContext db) =>
{
    var jogo = await db.Jogos.FindAsync(id);
    
    if (jogo is null) 
    {
        return Results.NotFound();
    }

    db.Jogos.Remove(jogo);
    await db.SaveChangesAsync();
    
    return Results.NoContent();
});

app.Run("http://localhost:5050");


record JogoEntradaDto(string Titulo, string Desenvolvedora);

class JogoEntity
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Desenvolvedora { get; set; } = string.Empty;
}

class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {
    }

    public DbSet<JogoEntity> Jogos => Set<JogoEntity>();
}
