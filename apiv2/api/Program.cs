using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using TapAndGo.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// 🔐 JWT Key embebida
var jwtKey = "clave-secreta-super-segura-123456789";

// 🧩 Cadena de conexión directa para SQL Server en el host (desde Docker)
var connectionString = "Server=host.docker.internal;Database=TapAndGoDb;User Id=tapandgo_user;Password=123456;TrustServerCertificate=True;";
// 🔗 Política de CORS
var corsPolicy = "_tapandgoCors";

builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicy, builder =>
    {
        builder.WithOrigins(
            "http://localhost:5284",          // frontend Razor local
            "http://192.168.1.137:5284",      // desde red
            "http://localhost:3000",          // React
            "http://127.0.0.1:5284",          // navegadores
            "https://tapandgoapi.loca.lt"     // túnel externo
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// Controladores API
builder.Services.AddControllers();

// 🔐 Configuración JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        RoleClaimType = ClaimTypes.Role
    };
});

// 📦 Swagger para testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Ingrese el token JWT en este formato: Bearer {token}"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// 📂 Inyección del contexto de base de datos con conexión directa
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

var app = builder.Build();

// 🧪 Swagger solo en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(corsPolicy);
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Ruta raíz para prueba
app.MapGet("/", () => "¡API TapAndGo está corriendo!");

app.Run("http://0.0.0.0:8080");
