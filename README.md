<!-- reload the vagrant after change in vagrant file -->

vagrant reload

docker build -t fastify-backend:latest .
podman build -t fastify-backend:latest .

<!-- To enable to local registry of docker images -->

microk8s enable registry

<!-- To verify the registry -->

microk8s kubectl get pods -n container-registry
curl http://localhost:32000/v2/\_catalog

<!-- List down all the tags -->

curl http://localhost:32000/v2/my-backend/tags/list

<!-- build docker image with podman that will use local registry -->

podman build -t localhost:32000/my-backend:3d19f8a38e86b2fef1d8e10e70577a0c55f8247d .

<!-- if you have alread image that you need to push on local registry change the tag name -->

podman tag my-app:latest localhost:32000/my-app:latest

<!-- change the registries of the podman because it is using https instead of http -->

sudo nano /etc/containers/registries.conf

<!-- add -->

[[registry]]
location = "localhost:32000"
insecure = true

<!-- push the image on registry -->

podman push localhost:32000/my-app:latest

podman push localhost:32000/my-backend:3d19f8a38e86b2fef1d8e10e70577a0c55f8247d

<!-- To apply deployment file -->

sudo microk8s kubectl apply -f deployment.yaml
kubectl get deployments
kubectl get deployments --namespace=production
kubectl get deployments --all-namespaces
kubectl get deployments -o wide
kubectl describe deployment <deployment-name>
kubectl delete deployment my-backend --namespace=production
kubectl get pods

<!-- port forward the kubernetes dashboard -->

sudo microk8s kubectl port-forward -n kube-system service/kubernetes-dashboard 10443:443

<!-- access kubernetes dashboard via curl -->

curl -k https://localhost:10443

<!-- To create a token to kubernetes dashboards -->

sudo microk8s kubectl create token default
