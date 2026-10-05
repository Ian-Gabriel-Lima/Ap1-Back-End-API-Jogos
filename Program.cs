using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

var jogos = new List<JogoDto>
{
    new JogoDto(1, "God of War 3", "Santa Monica Studio"),
    new JogoDto(2, "Red Dead Redemption 2", "Rockstar Games")
};

app.MapGet("/", () => Results.Ok(new { mensagem = "API de Jogos está online! Bem vindo(a)!", status = "OK" }));

app.MapGet("/api/jogos", () => Results.Ok(jogos));

app.MapGet("/api/jogos/{id:int}", (int id) =>
{
    var jogo = jogos.Find(jogoEncontrado => jogoEncontrado.Id == id);

    if (jogo is null)
    {
        return Results.NotFound();
    }
    else
    {
        return Results.Ok(jogo);
    }
});

app.MapPost("/api/jogos", (JogoEntradaDto dados) =>
{
    int proximoId = 1;
    if (jogos.Count > 0)
    {
        proximoId = jogos.Max(jogoEncontrado => jogoEncontrado.Id) + 1;
    }

    var novoJogo = new JogoDto(proximoId, dados.Titulo, dados.Desenvolvedora);

    jogos.Add(novoJogo);

    return Results.Created($"/api/jogos/{novoJogo.Id}", novoJogo);
});

app.MapPut("/api/jogos/{id:int}", (int id, JogoEntradaDto dados) =>
{
    int indice = jogos.FindIndex(jogoEncontrado => jogoEncontrado.Id == id);
    if (indice == -1)
    {
        return Results.NotFound();
    }

    var jogoAtualizado = new JogoDto(id, dados.Titulo, dados.Desenvolvedora);
    jogos[indice] = jogoAtualizado;

    return Results.Ok(jogoAtualizado);
});

app.MapDelete("/api/jogos/{id:int}", (int id) =>
{
    int indice = jogos.FindIndex(jogoEncontrado => jogoEncontrado.Id == id);
    if (indice == -1)
    {
        return Results.NotFound();
    }

    jogos.RemoveAt(indice);
    return Results.NoContent();
});

app.Run("http://localhost:5050");

record JogoDto(int Id, string Titulo, string Desenvolvedora);
record JogoEntradaDto(string Titulo, string Desenvolvedora);

class JogoEntity
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Desenvolvedora { get; set; } = string.Empty;
}

class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<JogoEntity> Jogos => Set<JogoEntity>();
}