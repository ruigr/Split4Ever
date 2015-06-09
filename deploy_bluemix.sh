#!/bin/sh

IP=129.41.227.180
CONTAINER_NAME=vwparts
PORT=8080
REGISTRY=registry-ice.ng.bluemix.net
ORG=techdays


sed -i -- "s/EXPOSE.*/EXPOSE\ $PORT/g" Dockerfile
sed -i -- "s/DOCKER.*/DOCKER\ true/g" Dockerfile
sed -i -- "s/CONTEXT.*/CONTEXT\ bluemix/g" Dockerfile
sed -i -- "s/PORT.*/PORT\ $PORT/g" Dockerfile
sed -i -- "s/DB_CONN_STR.*/DB_CONN_STR\ DUMMY/g" Dockerfile

ice stop $CONTAINER_NAME
sleep 8
ice rm $CONTAINER_NAME
sleep 8
#ice rmi $REGISTRY/$ORG/$CONTAINER_NAME:latest
ice --local pull $REGISTRY/ibmnode

ice --local build -t $CONTAINER_NAME .
ice --local tag anpr $REGISTRY/$ORG/$CONTAINER_NAME
ice --local push $REGISTRY/$ORG/$CONTAINER_NAME

ice run --name $CONTAINER_NAME $REGISTRY/$ORG/$CONTAINER_NAME:latest /bin/sh
#ice run --name $CONTAINER_NAME -p $PORT $REGISTRY/$ORG/$CONTAINER_NAME:latest

ice ip bind $IP $CONTAINER_NAME
