# Add External Secret Operator Using Hashicorp Vault Locally
We are going to do in steps
1. Hashicorp Vault Setup : this would be our local vault server.
2. External Secrets Operator (ESO) Installation
3. Automatic Secret Generation: ESO will create kubernetes secret automaticaly
4. Consume Secrets In application

Ref: https://github.com/rslim087a/vault-kubernetes-external-secrets-tutorial

## 1. 🔑 Install HashiCorp Vault (Dev Mode)
### Add the HashiCorp Helm Repository:
```sh
$ sudo microk8s helm repo add hashicorp https://helm.releases.hashicorp.com
$ sudo microk8s helm repo update
```

### Install Vault: Install Vault into its own namespace, enabling development mode and the UI for easy access. We use a ClusterIP service since ESO will connect to it internally.
```sh
$ sudo microk8s helm install vault hashicorp/vault \
  --namespace vault --create-namespace \
  --set 'server.dev.enabled=true' \
  --set 'ui.enabled=true'
```

### Find the Vault Service Address: Get the internal ClusterIP for the Vault service. ESO will use this.
```sh
$ sudo microk8s kubectl get svc -n vault
```

### Get default token to login
```sh
$ sudo microk8s kubectl logs -f vault-0 -n vault
```

### Verify the vault health by calling service
```sh
$ curl -s http://vault.vault:8200/v1/sys/health
```

## 2. Configure Vault Secrets and Policy
Next, you need to create a secret in Vault and configure the Kubernetes authentication method so ESO can access it securely.
### Access the Vault Pod: Get a shell inside the running Vault pod.
```sh
$ sudo microk8s kubectl exec -it vault-0 -n vault -- /bin/sh
```

### Enable KV Secrets Engine (Version 2):
```sh
$ vault secrets enable -version=2 kv
```

### Create a Sample Secret: Put your simulated secret into Vault.
```sh
$ vault kv put kv/my-app/config username=app-user password=secret-value-123
```

### Enable Kubernetes Authentication: This allows Kubernetes Service Accounts to log into Vault.
```sh
$ vault auth enable kubernetes
```

### Create a Policy for ESO: A policy that allows reading secrets from the specific path (kv/data/my-app/*).
```sh
$ vault policy write eso-read-policy -<<EOF
path "kv/data/my-app/*" {
  capabilities = ["read"]
}
EOF
```

### Create a Role for ESO: Bind the policy to the default Service Account used by ESO.
```sh
$ # Assuming ESO is in the 'external-secrets' namespace and uses the 'external-secrets' SA
vault write auth/kubernetes/role/eso-role \
  bound_service_account_names=external-secrets \
  bound_service_account_namespaces=external-secrets \
  policies=eso-read-policy \
  ttl=24h
```

### Exit the Vault Pod:
```sh
$ exit
```

## 3. Install and Configure External Secrets Operator (ESO)
### Install ESO: (If you haven't already from the previous answer).
```sh
# 1. Add the repository
sudo microk8s helm repo add external-secrets https://charts.external-secrets.io

# 2. Update the local repository cache
$ sudo microk8s helm repo update

# 3. Install ESO
$ sudo microk8s helm install external-secrets external-secrets/external-secrets \
  --namespace external-secrets --create-namespace \
  --set installCRDs=true
```

Create the secret with the token which will require to authenticate to Vault.
We are not using Secret and Policy way to authenticate
```sh
$ sudo microk8s kubectl create secret generic vault-token-secret \
  --from-literal=token="root" \
  --namespace local-devops
```
### Create the ClusterSecretStore: This tells ESO how to authenticate to and communicate with your local Vault instance using the Kubernetes Service Account you configured in the previous step.
Create a file named *vault-clustersecretstore.yaml*:
```yaml
# vault-clustersecretstore.yaml
apiVersion: external-secrets.io/v1
kind: ClusterSecretStore
metadata:
  name: hashicorp-vault-local
spec:
  provider:
    vault:
      server: "http://vault.vault:8200" # Internal ClusterIP address
      path: "kv"
      version: "v2"
      auth:
        kubernetes:
          mountPath: "kubernetes" # The Vault K8s Auth Mount Path
          role: "eso-role"        # The Vault role created in Step 2
          serviceAccountRef:
            name: external-secrets
            namespace: external-secrets
```

### Apply the SecretStore:
```sh
$ sudo microk8s kubectl apply -f vault-clustersecretstore.yaml
```

## 4. Create ExternalSecret and Consume
### Create the ExternalSecret: This defines which secret to fetch from Vault and the name of the final Kubernetes Secret.
Create a file named *my-app-externalsecret.yaml*:
```yaml
# my-app-externalsecret.yaml
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: my-app-synced-secrets
  namespace: default # Your application's namespace
spec:
  refreshInterval: "1m"
  secretStoreRef:
    kind: ClusterSecretStore
    name: hashicorp-vault-local
  target:
    name: my-app-k8s-secret # The K8s Secret to be created
    creationPolicy: Owner
  data:
    - secretKey: DB_USERNAME
      remoteRef:
        key: my-app/config # Path in Vault: kv/my-app/config
        property: username # Key in Vault secret
    - secretKey: DB_PASSWORD
      remoteRef:
        key: my-app/config
        property: password
```

### Apply and Verify:
```sh
sudo microk8s kubectl apply -f my-app-externalsecret.yaml
# Check the created Kubernetes secret
sudo microk8s kubectl get secret my-app-k8s-secret -o yaml
```

#### Verify the external secret 
If there is any issue you can see here.
```sh
$ sudo microk8s kubectl describe externalsecret local-devops-secret -n local-devops
```

**Consume in Deployment:** Inject the secret into your application pod's environment variables using the standard valueFrom or envFrom fields, just as you would with a synced GCP Secret.
```yaml
env:
- valueFrom:
    secretKeyRef:
        name: my-app-synced-secrets
        key: DB_USERNAME
        version: "1"
```