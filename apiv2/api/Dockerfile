# Etapa base: imagen de ejecución (más liviana)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Etapa build: compilar la aplicación
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar archivo de proyecto y restaurar dependencias
COPY ["TapAndGo.Api/TapAndGo.Api.csproj", "TapAndGo.Api/"]
RUN dotnet restore "TapAndGo.Api/TapAndGo.Api.csproj"

# Copiar el resto del código y compilar
COPY . .
WORKDIR "/src/TapAndGo.Api"
RUN dotnet build "TapAndGo.Api.csproj" -c Release -o /app/build

# Etapa publish: publicar app para producción
FROM build AS publish
RUN dotnet publish "TapAndGo.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa final: imagen lista para producción
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "TapAndGo.Api.dll"]
