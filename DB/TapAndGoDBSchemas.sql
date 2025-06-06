USE [TapAndGoDb]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 28/04/2025 10:23:13 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Clientes]    Script Date: 28/04/2025 10:23:13 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Clientes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](max) NOT NULL,
	[FechaRegistro] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Clientes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MenuItems]    Script Date: 28/04/2025 10:23:13 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MenuItems](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](max) NOT NULL,
	[Calorias] [decimal](10, 2) NOT NULL,
	[Categoria] [nvarchar](max) NOT NULL,
	[Descripcion] [nvarchar](max) NOT NULL,
	[Imagen] [nvarchar](max) NOT NULL,
	[PrecioChico] [decimal](10, 2) NOT NULL,
	[PrecioGrande] [decimal](10, 2) NOT NULL,
	[PrecioMediano] [decimal](10, 2) NOT NULL,
	[Stock] [decimal](10, 2) NOT NULL,
	[Tipo] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_MenuItems] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PedidoDetalles]    Script Date: 28/04/2025 10:23:13 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PedidoDetalles](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PedidoId] [int] NOT NULL,
	[MenuItemId] [int] NOT NULL,
	[Cantidad] [int] NOT NULL,
	[Tamano] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_PedidoDetalles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Pedidos]    Script Date: 28/04/2025 10:23:13 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Pedidos](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Total] [decimal](10, 2) NOT NULL,
	[Fecha] [datetime2](7) NOT NULL,
	[Estado] [nvarchar](max) NOT NULL,
	[ClienteId] [int] NOT NULL,
 CONSTRAINT [PK_Pedidos] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuarios]    Script Date: 28/04/2025 10:23:13 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuarios](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](max) NOT NULL,
	[PasswordHash] [nvarchar](max) NOT NULL,
	[Rol] [nvarchar](max) NOT NULL,
	[Name] [nvarchar](max) NULL,
 CONSTRAINT [PK_Usuarios] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[MenuItems] ADD  DEFAULT ((0.0)) FOR [Calorias]
GO
ALTER TABLE [dbo].[MenuItems] ADD  DEFAULT (N'') FOR [Imagen]
GO
ALTER TABLE [dbo].[MenuItems] ADD  DEFAULT ((0.0)) FOR [PrecioChico]
GO
ALTER TABLE [dbo].[MenuItems] ADD  DEFAULT ((0.0)) FOR [PrecioGrande]
GO
ALTER TABLE [dbo].[MenuItems] ADD  DEFAULT ((0.0)) FOR [PrecioMediano]
GO
ALTER TABLE [dbo].[MenuItems] ADD  DEFAULT ((0.0)) FOR [Stock]
GO
ALTER TABLE [dbo].[MenuItems] ADD  DEFAULT (N'') FOR [Tipo]
GO
ALTER TABLE [dbo].[PedidoDetalles] ADD  DEFAULT (N'') FOR [Tamano]
GO
ALTER TABLE [dbo].[Pedidos] ADD  DEFAULT (N'') FOR [Estado]
GO
ALTER TABLE [dbo].[Pedidos] ADD  DEFAULT ((0)) FOR [ClienteId]
GO
ALTER TABLE [dbo].[Usuarios] ADD  DEFAULT (N'') FOR [Rol]
GO
ALTER TABLE [dbo].[PedidoDetalles]  WITH CHECK ADD  CONSTRAINT [FK_PedidoDetalles_MenuItems_MenuItemId] FOREIGN KEY([MenuItemId])
REFERENCES [dbo].[MenuItems] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PedidoDetalles] CHECK CONSTRAINT [FK_PedidoDetalles_MenuItems_MenuItemId]
GO
ALTER TABLE [dbo].[PedidoDetalles]  WITH CHECK ADD  CONSTRAINT [FK_PedidoDetalles_Pedidos_PedidoId] FOREIGN KEY([PedidoId])
REFERENCES [dbo].[Pedidos] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PedidoDetalles] CHECK CONSTRAINT [FK_PedidoDetalles_Pedidos_PedidoId]
GO
ALTER TABLE [dbo].[Pedidos]  WITH CHECK ADD  CONSTRAINT [FK_Pedidos_Clientes_ClienteId] FOREIGN KEY([ClienteId])
REFERENCES [dbo].[Clientes] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Pedidos] CHECK CONSTRAINT [FK_Pedidos_Clientes_ClienteId]
GO

INSERT INTO Usuarios (Email, PasswordHash, Rol, Name)
VALUES ('admin@admin.com', '123456', 'admin','admin');

INSERT INTO Usuarios (Email, PasswordHash, Rol, Name)
VALUES ('cocina@cocina.com', '123456', 'cocina','cocinero');

INSERT INTO Usuarios (Email, PasswordHash, Rol, Name)
VALUES ('mesero@mesero.com', '123456', 'mesero','mesero');

Select * from Usuarios;

INSERT INTO MenuItems (Nombre, Calorias, Categoria, Descripcon, Imagen, PrecioChico, PrecioGrande, PrecioMediano, Stock, Tipo)
VALUES ('Pizza peperoni', 450, 'Pizzas','Pizza sencilla', '/img/products/1.jpg',100,140,120,200,'Comida');
INSERT INTO MenuItems (Nombre, Calorias, Categoria, Descripcion, Imagen, PrecioChico, PrecioGrande, PrecioMediano, Stock, Tipo)
VALUES ('Coca-Cola', 50, 'Sodas','Refresco de cola', '/img/products/coca.jpg',25,35,30,200,'Bebida');
INSERT INTO MenuItems (Nombre, Calorias, Categoria, Descripcion, Imagen, PrecioChico, PrecioGrande, PrecioMediano, Stock, Tipo)
VALUES ('pie de manzana', 250, 'Pies','Pie de manzana', '/img/products/piemanzana.jpg',120,160,140,200,'Postre');
INSERT INTO MenuItems (Nombre, Calorias, Categoria, Descripcion, Imagen, PrecioChico, PrecioGrande, PrecioMediano, Stock, Tipo)
VALUES ('Nuggets de pollo', 70, 'Nuggets','Nuggets de pollo', '/img/products/nuggets.jpg',50,70,60,200,'Complemento');
INSERT INTO MenuItems (Nombre, Calorias, Categoria, Descripcion, Imagen, PrecioChico, PrecioGrande, PrecioMediano, Stock, Tipo)
VALUES ('Hamburguesa Vegana', 180, 'Hamburguesas','Hamburguesa sin carne ni gluten, hecha de soya', '/img/products/hamburguesavegana.jpg',70,80,75,200,'Comida');
INSERT INTO MenuItems (Nombre, Calorias, Categoria, Descripcion, Imagen, PrecioChico, PrecioGrande, PrecioMediano, Stock, Tipo)
VALUES ('Sprite', 125, 'Sodas','Refresco de limón', '/img/products/sprite.jpg',20,30,25,200,'Bebida');
INSERT INTO MenuItems (Nombre, Calorias, Categoria, Descripcion, Imagen, PrecioChico, PrecioGrande, PrecioMediano, Stock, Tipo)
VALUES ('Papas en Gajo', 200, 'Papas','Papas en gajo con queso', '/img/products/papas.jpg',50,60,65,200,'Complemento');
INSERT INTO MenuItems (Nombre, Calorias, Categoria, Descripcion, Imagen, PrecioChico, PrecioGrande, PrecioMediano, Stock, Tipo)
VALUES ('Hamburguesa de Carne', 250, 'Hamburguesas','Hamburguesa sencilla con queso', '/img/products/hamburguesacarne.jpg',65,80,70,200,'Comida');
INSERT INTO MenuItems (Nombre, Calorias, Categoria, Descripcion, Imagen, PrecioChico, PrecioGrande, PrecioMediano, Stock, Tipo)
VALUES ('Pizza Champiñones', 450, 'Pizzas','Pizza de champiñones', '/img/products/2.jpg',100,140,120,200,'Comida');
INSERT INTO MenuItems (Nombre, Calorias, Categoria, Descripcion, Imagen, PrecioChico, PrecioGrande, PrecioMediano, Stock, Tipo)
VALUES ('Pizza de vegetales', 200, 'Pizzas','Pizza de vegetales', '/img/products/3.jpg',80,100,90,200,'Comida');
INSERT INTO MenuItems (Nombre, Calorias, Categoria, Descripcion, Imagen, PrecioChico, PrecioGrande, PrecioMediano, Stock, Tipo)
VALUES ('Pizza de queso', 450, 'Pizzas','Pizza de queso', '/img/products/8.jpg',80,90,85,200,'Comida');

Select * from MenuItems;

Delete from Usuarios;