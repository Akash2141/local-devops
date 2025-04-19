<!-- reload the vagrant after change in vagrant file -->

```console
vagrant reload
```

```console
vagrant up
```

```console
vagrant destroy
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
podman build -t localhost:32000/my-backend:v1 .
podman build -t localhost:32000/my-backend:v2 .
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
podman push localhost:32000/my-backend:v1
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
sudo microk8s kubectl run my-backend --image=localhost:32000/my-backend:v1 --port=8080 --restart=Never

```

<!-- POD Debug using BusyBox/curlpod -->

```console
sudo microk8s kubectl run -it --rm --restart=Never busybox --image=gcr.io/google-containers/busybox sh

sudo microk8s kubectl run -it --rm --restart=Never curlpod --image=curlimages/curl sh
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
curl 10.1.192.138:8080/get/users
curl 10.152.183.42:8080/get/users
curl 10.152.183.42:8080/get/users
```

<!-- Delete Pod -->

```console
sudo microk8s kubectl delete pod <pod-name>
sudo microk8s kubectl delete pod my-backend-replicaset-8vhhx -n local-devops
```

<!-- Get Replicaset -->

```console
sudo microk8s kubectl get replicaset -n local-devops
```

<!-- Delete Replicasets -->

```console
sudo microk8s kubectl delete replicaset <replicaset-name> -n local-devops
sudo microk8s kubectl delete replicaset my-backend-replicaset -n local-devops
```

<!-- Enable Services In Microk8s -->

```console
sudo microk8s enable dns

sudo microk8s enable storage

sudo microk8s enable rbac

sudo microk8s enable ingress

sudo microk8s enable metallb
```

<!-- Install Microk8s In cluster -->

```console

sudo microk8s kubectl create namespace argocd

sudo microk8s kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

sudo microk8s kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort", "ports": [{"port": 443, "targetPort": 8080, "nodePort": 30267}]}}'

sudo microk8s kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 --decode


```

<!-- Port forward service -->

```console
sudo microk8s kubectl port-forward svc/my-backend-clusterip 8082:8080 -n local-devops
```

<!-- To get the IP Of Node -->

```console
sudo microk8s kubectl get nodes -o wide
```

<!-- Refer Kustomization -->

```url
https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/
```

```
kubectl apply --dry-run=client -o yaml -k ./
```

<!-- Verify the changes in kustomize -->

```
microk8s kubectl kustomize .
```

<!-- Gell All resources -->

```
kubectl get all
```

<!-- Ingress -->

```
sudo microk8s kubectl get pods -n ingress
```

```
sudo microk8s kubectl exec -it nginx-ingress-microk8s-controller-82xtr -n ingress -- bash
```

<!-- Check the nginx.conf -->

```
sudo nano nginx.conf
```

# Emissary Ingress Setup

Ambasador Reference

```url
https://www.getambassador.io/docs/emissary/latest/topics/concepts/kubernetes-network-architecture
https://www.getambassador.io/docs/emissary/latest/howtos/configure-communications
```

Ambassador Installation

```
sudo microk8s enable metallb
```

```console
192.168.1.100-192.168.1.200
```

```
cd practice-k8s/emissary-ingress/
sudo microk8s kubectl apply -f namespace.yaml
sudo microk8s kubectl apply -f service.yaml
sudo microk8s kubectl apply -f deployment.yaml
sudo microk8s kubectl apply -f http-listener.yaml
sudo microk8s kubectl apply -f host.yaml
sudo microk8s kubectl apply -f mapping.yaml
sudo nano /etc/hosts
192.168.1.100 firstproject.localdevops.com
curl http://firstproject.localdevops.com/get/users
sudo microk8s kubectl get pods -n emissary
sudo microk8s kubectl get svc -n emissary
sudo microk8s kubectl get listeners -n emissary
sudo microk8s kubectl get hosts -n emissary
sudo microk8s kubectl get mappings -n local-devops
sudo microk8s kubectl get svc -n local-devops
curl -H "Host: firstproject.localdevops.com" http://192.168.1.100/get/users
```

```
sudo microk8s kubectl create namespace emissary && \
sudo microk8s kubectl apply -f https://app.getambassador.io/yaml/emissary/3.9.1/emissary-crds.yaml && \
sudo microk8s kubectl wait --timeout=90s --for=condition=available deployment emissary-apiext -n emissary-system

sudo microk8s kubectl apply -f https://app.getambassador.io/yaml/emissary/3.9.1/emissary-emissaryns.yaml && \
sudo microk8s kubectl -n emissary wait --for condition=available --timeout=90s deploy -lproduct=aes

```

## Listener

```
---
apiVersion: getambassador.io/v3alpha1
kind: Listener
metadata:
  name: http-listener
  namespace: ambassador
spec:
  port: 8080
  protocol: HTTP
  hostBinding:
    namespace:
      from: ALL
```

## Host

```
---
apiVersion: getambassador.io/v3alpha1
kind: Host
metadata:
  name: http-example-host
  namespace: ambassador
spec:
  hostname: firstproject.localdevops.com
  requestPolicy:
    insecure:
      action: Route
```

## Mapping

```
apiVersion: getambassador.io/v3alpha1
kind: Mapping
metadata:
  name: http-example-mapping
  namespace: ambassador
spec:
  prefix: /
  hostname: example.com
  service: httpbin.org
```
