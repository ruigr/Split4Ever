#!/bin/sh

CONTAINER_NAME=vwparts
MONGO_SERVICE=mongolab
MONGO_PLAN=sandbox
MONGO_INSTANCE=mongo
BRIDGE_APP="$CONTAINER_NAME"bridge


#cf delete $BRIDGE_APP
cf push $BRIDGE_APP -i 1 -k 1M -m 64M --no-hostname --no-manifest --no-route --no-start

#cf unbind-service $BRIDGE_APP $MONGO_INSTANCE
#cf delete-service $MONGO_INSTANCE -f
cf create-service $MONGO_SERVICE $MONGO_PLAN $MONGO_INSTANCE
cf bind-service $BRIDGE_APP $MONGO_INSTANCE
cf env $BRIDGE_APP

