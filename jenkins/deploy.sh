echo "starting awesome react docker deployment script"

echo "stopping old container (if exists)"
docker stop kdm-frontend

echo "removing old container (if able)"
docker rm kdm-frontend

echo "building new image"
docker build -t kdm-frontend .

echo "starting new container"
JENKINS_NODE_COOKIE=dontkillme docker run -d  \
  --name kdm-frontend \
  --network=docker-network \
  -p 5000:5000 \
  --rm \
  kdm-frontend
