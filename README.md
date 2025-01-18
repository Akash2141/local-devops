<!-- reload the vagrant after change in vagrant file -->

```console
vagrant reload
```

```console
docker build -t fastify-backend:latest .
```

```console
podman build -t fastify-backend:latest .
```

<!-- To enable to local registry of docker images -->

```console
microk8s enable registry
```

<!-- To verify the registry -->

```console
microk8s kubectl get pods -n container-registry
```

```console
curl http://localhost:32000/v2/\_catalog
```

<!-- List down all the tags -->

```console
curl http://localhost:32000/v2/my-backend/tags/list
```

<!-- build docker image with podman that will use local registry -->

```console
podman build -t localhost:32000/my-backend:3d19f8a38e86b2fef1d8e10e70577a0c55f8247d .
```

<!-- if you have alread image that you need to push on local registry change the tag name -->

```console
podman tag my-app:latest localhost:32000/my-app:latest
```

<!-- change the registries of the podman because it is using https instead of http -->

```console
sudo nano /etc/containers/registries.conf
```

<!-- add -->

```
[[registry]]
location = "localhost:32000"
insecure = true
```

<!-- push the image on registry -->

```console
podman push localhost:32000/my-app:latest
```

```console
podman push localhost:32000/my-backend:3d19f8a38e86b2fef1d8e10e70577a0c55f8247d
```

<!-- To apply deployment file -->

```console
sudo microk8s kubectl apply -f deployment.yaml
```

```console
kubectl get deployments
```

```console
kubectl get deployments --namespace=production
```

```console
kubectl get deployments --all-namespaces
```

```console
kubectl get deployments -o wide
```

```console
kubectl describe deployment <deployment-name>
```

```console
kubectl delete deployment my-backend --namespace=production
```

```console
kubectl get pods
```

<!-- port forward the kubernetes dashboard -->

```console
sudo microk8s kubectl port-forward -n kube-system service/kubernetes-dashboard 10443:443 --address=0.0.0.0
```

<!-- access kubernetes dashboard via curl -->

```console
curl -k https://localhost:10443
```

<!-- To create a token to kubernetes dashboards -->

```console
sudo microk8s kubectl create token default
```

<!-- POD Creation -->

```console
sudo microk8s kubectl run my-backend --image=localhost:32000/my-backend:3d19f8a38e86b2fef1d8e10e70577a0c55f8247d --port=8080 --restart=Never

```

<!-- POD Debug using BusyBox -->

```console
sudo microk8s kubectl run -it --rm --restart=Never busybox --image=gcr.io/google-containers/busybox sh
```

<!-- GET POD with IP Address -->

```console
sudo microk8s kubectl get pods -o wide
```

<!-- Enable Load Balancer In Microk8s -->

```console
sudo microk8s enable metallb
```

<!-- provide IP Address range -->

```console
192.168.1.100-192.168.1.200
```

<!-- Verify MetaLB -->

```console
sudo microk8s kubectl get pods -n metallb-system
```

<!-- Expose pod to load balancer service -->

```console
sudo microk8s kubectl expose pod my-backend --type=LoadBalancer --name=my-backend-http --port=8080 --target-port=8080
```

<!-- Delete service -->

```console
sudo microk8s kubectl delete service my-backend-http
```

<!-- Access the service using external IP address -->

```console
curl 192.168.1.100:8080/get/users
```
