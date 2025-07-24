#!/bin/bash

sudo docker load -i /tmp/mgis-stage-frontend-"$version".tar
sudo rm -rf /tmp/mgis-stage-frontend-"$version".tar
sudo docker rm -f mgis-frontend
sudo docker run -d --name mgis-frontend -p 80:80 neun/stage/mgis-frontend:"$version"
unset version
