using ApiJogos.models;
using ApiJogos.Data;
using ApiJogos.Dtos;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=jogos.db"));

builder.Services.AddCors();

var app = builder.Build();

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { mensagem = "Ocorreu um erro interno no servidor" });
    });
});
app.MapGet("/api/teste-erro", () =>
{
    throw new InvalidOperationException("erro de teste");
});


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
