echo "starting awesome react docker deployment script"

echo "stopping old container"
docker stop kdm-frontend-dc

echo "building new image"
docker build -t kdm-frontend-dc .

echo "whoami: " 
whoami
echo "PWD: " ${PWD}
echo "ls:"
ls -l
echo "starting new container"

JENKINS_NODE_COOKIE=dontkillme docker run -d  \
  --name kdm-frontend-dc \
  -p 5000:5000 \
  --rm \
  kdm-frontend-dc
