# Kubernetes set context

Used for setting the target Kubernetes cluster context which will be used by other actions like [`magneticio/vamp-actions/kubernetes-deploy`](https://github.com/magneticio/vamp-actions/tree/master/kubernetes-deploy), etc. or run any kubectl commands.

```yaml
- uses: magneticio/vamp-actions/kubernetes-context@master
  with:
    kubeconfig: '<your kubeconfig>'v# Use secret (https://developer.github.com/actions/managing-workflows/storing-secrets/)
    context: '<context name>'  # Optional, uses the current-context from kubeconfig by default
  id: login
```

```yaml
- uses: magneticio/vamp-actions/kubernetes-context@master
  with:
    cluster-url: "<your kubernetes cluster url>"
    user-secret: "<service account token>" # token value from the result of the below script
  id: login
```

Use secret (https://developer.github.com/actions/managing-workflows/storing-secrets/) in workflow for kubeconfig or Kubernetes values.

PS: `kubeconfig` takes precedence (i.e. kubeconfig would be created using the value supplied in kubeconfig)

Refer to the [action metadata file](https://github.com/magneticio/kubernetes-actions/blob/master/kubernetes-context/action.yml) for details about all the inputs.

## Steps to get Kubeconfig of a K8s cluster:

### For any Kubernetes cluster

Please refer to https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/

### For Azure Kubernetes Service (AKS)

```sh
az aks get-credentials --name
                       --resource-group
                       [--admin]
                       [--file]
                       [--overwrite-existing]
                       [--subscription]
```

Refer to https://docs.microsoft.com/en-us/cli/azure/aks?view=azure-cli-latest#az-aks-get-credentials

## Steps to get Service account:

#### cluster-url: Run in your local shell to get server Kubernetes Cluster URL

```sh
kubectl config view --minify -o jsonpath={.clusters[0].cluster.server}
```

#### user-secret: Run following sequential commands to get the secret value:

Get service account secret names by running

```sh
kubectl get sa <service-account-name> -n <namespace> -o=jsonpath={.secrets[*].name}
```

Use the output of the above command

```sh
kubectl get secret <service-account-secret-name> -n <namespace> -o json
```

## Using secret for Kubeconfig or Service Account

Now add the values as [a secret](https://developer.github.com/actions/managing-workflows/storing-secrets/) in the GitHub repository. In the example below the secret name is `KUBE_CONFIG` and it can be used in the workflow by using the following syntax:

```yaml
- uses: magneticio/vamp-actions/kubernetes-context@master
  with:
    kubeconfig: ${{ secrets.KUBE_CONFIG }}
```
