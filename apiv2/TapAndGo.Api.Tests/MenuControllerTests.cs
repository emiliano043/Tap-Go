using Xunit;
using TapAndGo.Api.Controllers;
using TapAndGo.Api.Data;
using TapAndGo.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace TapAndGo.Api.Tests
{
    public class MenuControllerTests
    {
        [Fact]
        public void GetAll_ReturnsMenuItems()
        {
            // Arrange: configurar el contexto en memoria
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            // Crear datos falsos en la base en memoria
            using (var context = new AppDbContext(options))
            {
                context.MenuItems.AddRange(
                    new MenuItem
                    {
                        Id = 1,
                        Nombre = "Hamburguesa",
                        Tipo = "Comida",
                        Categoria = "Hamburguesas",
                        PrecioMediano = 100,
                        Descripcion = "Hamburguesa clásica",
                        Imagen = "hamburguesa.jpg",
                        Calorias = 500,
                        PrecioChico = 80,
                        PrecioGrande = 120,
                        Stock = 20
                    },
                    new MenuItem
                    {
                        Id = 2,
                        Nombre = "Soda",
                        Tipo = "Bebida",
                        Categoria = "Sodas",
                        PrecioMediano = 30,
                        Descripcion = "Refresco de cola",
                        Imagen = "soda.jpg",
                        Calorias = 150,
                        PrecioChico = 25,
                        PrecioGrande = 40,
                        Stock = 50
                    }
                );
                context.SaveChanges();
            }

            // Act: usar el controlador con el contexto ya poblado
            using (var context = new AppDbContext(options))
            {
                var controller = new MenuController(context);
                var resultado = controller.GetAll() as OkObjectResult;

                // Assert: verificar resultado
                Assert.NotNull(resultado);
                var items = resultado.Value as List<MenuItem>;
                Assert.NotNull(items);
                Assert.Equal(2, items.Count);
            }
        }
    }
}
