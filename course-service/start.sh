#!/bin/bash

# Build locally (development)
mvn clean package -f "learning/pom.xml"

# docker build -t course-service .
# docker run --rm  -p 8080:8080 -p 9990:9990 --name learning course-service
