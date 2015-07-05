FROM registry-ice.ng.bluemix.net/ibmnode:latest
RUN apt-get -y --fix-missing update
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install git sed bc vim ssh imagemagick

ENV DOCKER true
ENV CONTEXT local
ENV PORT 3000
ENV DB_CONN_STR mongodb://app:password@172.28.245.101:27017/vwparts

WORKDIR /
RUN mkdir -p /app
ADD dist /app
ADD package.json /app/


WORKDIR /app
RUN npm install -d --production 
EXPOSE 3000
CMD ["node", "backend/index.js"]
