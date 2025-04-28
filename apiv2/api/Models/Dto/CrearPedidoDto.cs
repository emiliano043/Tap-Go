public class CrearPedidoDto
{
    public string Cliente { get; set; }
    public List<CrearPedidoDetalleDto> Detalles { get; set; }
}

public class CrearPedidoDetalleDto
{
    public int MenuItemId { get; set; }
    public int Cantidad { get; set; }
    public string Tamano { get; set; }
}

public class PedidoDetalleDto
{
    public int MenuItemId { get; set; }
    public int Cantidad { get; set; }
    public string Tamano { get; set; }  
}
