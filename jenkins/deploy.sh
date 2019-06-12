echo "starting awesome react docker deployment script"

echo "stopping old container"
docker stop kdm-frontend

echo "building new image"
docker build -t kdm-frontend .

echo "starting new container"

JENKINS_NODE_COOKIE=dontkillme docker run -d  \
  --name kdm-frontend \
  -v ${PWD}:/usr/src/app \
  -v /usr/src/app/node_modules \
  -u root \
  -p 5000:5000 \
  --rm \
  kdm-frontend
