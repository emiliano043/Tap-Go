namespace TapAndGo.Api.Models
{


    public class Pedido
    {
        public int Id { get; set; }
        public string Cliente { get; set; }
        public decimal Total { get; set; }
        public string Estado { get; set; } = "en proceso";
        public DateTime Fecha { get; set; } = DateTime.Now;
        public List<PedidoDetalle> Detalles { get; set; } = new();


    }
}
