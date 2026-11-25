# Se construye con el contexto en la raíz del repositorio
# (Render: Docker Context = "." y Dockerfile Path = "./My Page/Dockerfile").
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /src

COPY ["My Page/My Page.csproj", "My Page/"]
RUN dotnet restore "My Page/My Page.csproj"

COPY . .
RUN dotnet publish "My Page/My Page.csproj" -c Release -o /app/out --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

ENTRYPOINT ["dotnet", "My Page.dll"]
