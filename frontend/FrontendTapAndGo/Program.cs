
// Add services to the container.
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthorization();

app.MapGet("/", () => Results.Redirect("/Login"));
app.MapRazorPages();


// 🔥 Abrir el navegador justo antes de iniciar el servidor
var url = "http://localhost:5000"; // o el puerto que estés usando
try
{
    var psi = new System.Diagnostics.ProcessStartInfo
    {
        FileName = url,
        UseShellExecute = true
    };
    System.Diagnostics.Process.Start(psi);
}
catch (Exception ex)
{
    Console.WriteLine("No se pudo abrir el navegador: " + ex.Message);
}

app.Run();
