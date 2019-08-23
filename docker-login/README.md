# Log in to a container registry

Use this GitHub Action to [log in to a private container registry](https://docs.docker.com/engine/reference/commandline/login/). Once login is done, the next set of actions in the workflow can perform tasks such as building, tagging and pushing containers.

```yaml
- uses: magneticio/vamp-actions/docker-login@master
  with:
    username: "<username>"
    password: "<password>"
    loginServer: "<login server>" # default: index.docker.io
    email: "<email id>"
```

Refer to the [action metadata file](https://github.com/magneticio/vamp-actions/blob/master/docker-login/action.yml) for details about all the inputs.

## You can build and push container registry by using the following example

```yaml
- uses: magneticio/vamp-actions/docker-login@master
      with:
        login-server: myregistry.com
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}
    - run: |
        docker build . -t myregistry.com/myapp:${{ github.sha }}
        docker push contoso.azurecr.io/myapp:${{ github.sha }}
```
