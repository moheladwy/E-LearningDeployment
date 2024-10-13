#!/bin/bash

sudo apt update && sudo apt upgrade -y

cd /home/eladwy/github/E-LearningDeployment/Jenkins || return 1

docker-compose -f docker-compose.yml up -d # it will startup the jenkins services on port 8090
