# Use a minimal base image with Java 17 Runtime
FROM eclipse-temurin:17-jre-jammy

# Set an argument for the JAR file path
ARG JAR_FILE=target/*.jar

# Copy the JAR file from the build context into the image
COPY ${JAR_FILE} app.jar

# Specify the command to run the application
ENTRYPOINT ["java", "-jar", "/app.jar"]