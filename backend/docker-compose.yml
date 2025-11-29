
# ===========================
# 1️⃣ STAGE DE BUILD
# ===========================
  FROM maven:3.9.6-eclipse-temurin-17 AS build
  
  WORKDIR /app
  
  # Copia apenas o pom.xml primeiro (cache das dependências)
  COPY pom.xml .
  
  RUN mvn dependency:go-offline -B
  
  # Copia o resto do código
  COPY . .
  
  # Gera o JAR
  RUN mvn clean package -DskipTests
  
  # ===========================
  # 2️⃣ STAGE DE EXECUÇÃO
  # ===========================
  FROM eclipse-temurin:17-jdk-jammy
  
  WORKDIR /app
  
  # Copia o JAR gerado
  COPY --from=build /app/target/projeto-de-extensao-0.0.1-SNAPSHOT.jar app.jar
  
  # Expondo porta padrão Spring Boot
  EXPOSE 8080
  
  # Comando de inicialização
  ENTRYPOINT ["java", "-jar", "app.jar"]
