#!/bin/sh

CONTAINER_NAME=vwparts
PORT=3000
REGISTRY=registry-ice.ng.bluemix.net
ORG=techdays
DB_CONNECTION_STR="mongodb:\/\/app:password@172.28.245.101:27017\/vwparts"

sed -i -- "s/EXPOSE.*/EXPOSE\ $PORT/g" Dockerfile
sed -i -- "s/DOCKER.*/DOCKER\ true/g" Dockerfile
sed -i -- "s/CONTEXT.*/CONTEXT\ local/g" Dockerfile
sed -i -- "s/PORT.*/PORT\ $PORT/g" Dockerfile
sed -i -- "s/DB_CONN_STR.*/DB_CONN_STR\ $DB_CONNECTION_STR/g" Dockerfile


#ice --local stop $CONTAINER_NAME
#sleep 8
#ice --local rm $CONTAINER_NAME
#sleep 8

#ice --local pull $REGISTRY/ibmnode

ice --local build -t $CONTAINER_NAME .
#ice --local tag $CONTAINER_NAME $REGISTRY/$ORG/$CONTAINER_NAME

ice --local run -d -p $PORT:$PORT $CONTAINER_NAME
#ice --local run -i -t -P=true  --entrypoint /bin/bash $CONTAINER_NAME
