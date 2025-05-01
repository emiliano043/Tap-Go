using Microsoft.EntityFrameworkCore;
using TapAndGo.Api.Models;

namespace TapAndGo.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Tablas (DbSets)
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<PedidoDetalle> PedidoDetalles { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar relaciones adicionales si es necesario

            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Cliente)
                .WithMany(c => c.Pedidos)
                .HasForeignKey(p => p.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PedidoDetalle>()
                .HasOne(pd => pd.Pedido)
                .WithMany(p => p.Detalles)
                .HasForeignKey(pd => pd.PedidoId);

            modelBuilder.Entity<PedidoDetalle>()
                .HasOne(pd => pd.MenuItem)
                .WithMany(mi => mi.Detalles)
                .HasForeignKey(pd => pd.MenuItemId);
        }
    }
}