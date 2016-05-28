#!/bin/sh

APP_NAME=vwparts
MONGO_SRV=mongo

#rm -rf node_modules

cf delete --f --r $APP_NAME
sleep 16 
cf push --no-start
#cf set-env $APP_NAME CONTEXT bluemix
cf start $APP_NAME
#sleep 8
#cf bind-service $APP_NAME $MONGO_SRV
#cf restage $APP_NAME
sleep 16 
cf logs $APP_NAME --recent

