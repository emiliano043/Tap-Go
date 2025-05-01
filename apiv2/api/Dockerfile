# Etapa base: imagen de ejecución (más liviana)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Etapa build: compilar la aplicación
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar archivos del proyecto
COPY . .

# Restaurar dependencias
RUN dotnet restore "./TapAndGo.Api.csproj"

# Compilar el proyecto
RUN dotnet build "./TapAndGo.Api.csproj" -c Release -o /app/build

# Publicar
FROM build AS publish
RUN dotnet publish "./TapAndGo.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Imagen final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "TapAndGo.Api.dll"]