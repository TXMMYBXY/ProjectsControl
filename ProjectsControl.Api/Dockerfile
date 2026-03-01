FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["ProjectsControl.Api/ProjectsControl.Api.csproj", "ProjectsControl.Api/"]
COPY ["ProjectsControl.Application/ProjectsControl.Application.csproj", "ProjectsControl.Application/"]
COPY ["ProjectsControl.Entities/ProjectsControl.Entities.csproj", "ProjectsControl.Entities/"]
COPY ["ProjectsControl.Infrastructure/ProjectsControl.Infrastructure.csproj", "ProjectsControl.Infrastructure/"]

RUN dotnet restore "ProjectsControl.Api/ProjectsControl.Api.csproj"

COPY . .
WORKDIR "/src/ProjectsControl.Api"
RUN dotnet publish "./ProjectsControl.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ProjectsControl.Api.dll"]