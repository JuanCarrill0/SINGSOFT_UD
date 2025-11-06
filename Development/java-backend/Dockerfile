# Usa una imagen oficial de Java
FROM openjdk:17-jdk-slim

# Directorio de trabajo en el contenedor
WORKDIR /app

# PRIMERO copia el pom.xml y descarga dependencias (para cache)
COPY pom.xml .
COPY src ./src

# Compila el proyecto (esto falta en tu lista)
RUN ./mvnw clean package -DskipTests

# Copia el JAR built
COPY target/eccomerce-backend-0.0.1-SNAPSHOT.jar app.jar

# Puerto que expone la aplicación
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]