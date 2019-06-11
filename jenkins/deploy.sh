echo "starting awesome react docker deployment script"
echo "start by building new image"

sudo docker stop kdm-frontend

sudo docker build -t kdm-frontend .

echo "starting new container"

JENKINS_NODE_COOKIE=dontkillme docker run -d  \
  --name kdm-frontend \
  -v ${PWD}:/usr/src/app \
  -v /usr/src/app/node_modules \
  -p 5000:5000 \
  --rm \
  kdm-frontend
