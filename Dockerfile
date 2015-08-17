FROM registry-ice.ng.bluemix.net/ibmnode:latest
RUN apt-get -y --fix-missing update
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install git sed bc vim ssh imagemagick

ENV DOCKER true
ENV CONTEXT local
ENV PORT 3000
ENV DB_CONN_STR mongodb://app:password@192.168.1.3:27017/vwparts

WORKDIR /
RUN mkdir -p /dist
ADD dist /dist
ADD package.json /dist/


# WORKDIR /dist
RUN npm install -d --production 
EXPOSE 3000
CMD ["node", "dist/backend/index.js"]
