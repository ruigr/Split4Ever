#!/bin/sh

IP=129.41.227.180
CONTAINER_NAME=vwparts
PORT=8080
REGISTRY=registry-ice.ng.bluemix.net
ORG=techdays
#MONGO_SERVICE=mongolab
MONGO_SERVICE=mongodb
#MONGO_PLAN=sandbox
MONGO_PLAN=100
MONGO_INSTANCE=mongo
BRIDGE_APP="$CONTAINER_NAME"bridge


sed -i -- "s/EXPOSE.*/EXPOSE\ $PORT/g" Dockerfile
sed -i -- "s/DOCKER.*/DOCKER\ true/g" Dockerfile
sed -i -- "s/CONTEXT.*/CONTEXT\ bluemix/g" Dockerfile
sed -i -- "s/PORT.*/PORT\ $PORT/g" Dockerfile
sed -i -- "s/DB_CONN_STR.*/DB_CONN_STR\ DUMMY/g" Dockerfile

ice stop $CONTAINER_NAME
sleep 8
ice rm $CONTAINER_NAME
#sleep 8
#ice rmi $REGISTRY/$ORG/$CONTAINER_NAME:latest

ice --local pull $REGISTRY/ibmnode:latest
ice --local build --tag $CONTAINER_NAME .
ice --local tag $CONTAINER_NAME $REGISTRY/$ORG/$CONTAINER_NAME
ice --local push $REGISTRY/$ORG/$CONTAINER_NAME


##cf delete $BRIDGE_APP
#cf unbind-service $BRIDGE_APP $MONGO_INSTANCE
#cf delete-service $MONGO_INSTANCE -f

#cf push $BRIDGE_APP -i 1 -k 1M -m 64M -d mybluemix.net --no-hostname --no-manifest --no-route --no-start
#cf create-service $MONGO_SERVICE $MONGO_PLAN $MONGO_INSTANCE
#cf bind-service $BRIDGE_APP $MONGO_INSTANCE
#sleep 20
#cf restage $BRIDGE_APP
cf env $BRIDGE_APP
#sleep 90
ice run --bind $BRIDGE_APP --name $CONTAINER_NAME -p $PORT $REGISTRY/$ORG/$CONTAINER_NAME:latest
sleep 16
ice ip bind $IP $CONTAINER_NAME
#ssh -i ~/.ssh/id_rsa root@129.41.227.180
#ice ip bind 129.41.227.180 vwparts
#ice run --bind vwpartsbridge --name vwparts -p 8080 registry-ice.ng.bluemix.net/techdays/vwparts:latest
#ice ip bind 129.41.227.180 vwparts
#cf bind-service vwpartsbridge mongo
