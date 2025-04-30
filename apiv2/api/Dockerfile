# Etapa base: imagen de ejecución (más liviana)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Etapa build: compilar la aplicación
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

<<<<<<< HEAD
# Copiar archivo de proyecto y restaurar dependencias
COPY ["TapAndGo.Api/TapAndGo.Api.csproj", "TapAndGo.Api/"]
RUN dotnet restore "TapAndGo.Api/TapAndGo.Api.csproj"

# Copiar el resto del código y compilar
COPY . .
WORKDIR "/src/TapAndGo.Api"
RUN dotnet build "TapAndGo.Api.csproj" -c Release -o /app/build
=======
# Copia los archivos al directorio
COPY ["TapAndGo.Api.csproj", "."]

# Direccion donde vivirá nuestra aplicación en el contenedor
RUN dotnet restore "./TapAndGo.Api.csproj"

# Copia todo lo de la ruta actual a la ruta del contenedor
COPY . .
WORKDIR "/src/."
RUN dotnet build "./TapAndGo.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build
>>>>>>> 017217b19a535a6f7a7872e8e5f0ef59037c46a1

# Etapa publish: publicar app para producción
FROM build AS publish
<<<<<<< HEAD
RUN dotnet publish "TapAndGo.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false
=======
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./TapAndGo.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false
>>>>>>> 017217b19a535a6f7a7872e8e5f0ef59037c46a1

# Etapa final: imagen lista para producción
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

<<<<<<< HEAD
ENTRYPOINT ["dotnet", "TapAndGo.Api.dll"]
=======
# Para que no se ejecute net core en vez de powershell en linux
ENTRYPOINT ["dotnet", "TapAndGo.Api.dll"]
>>>>>>> 017217b19a535a6f7a7872e8e5f0ef59037c46a1
