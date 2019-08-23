# Log out from a container registry

Use this GitHub Action to delete the container registry context from the runner. The context file is created when [docker-login](https://github.com/magneticio/vamp-actions/tree/master/docker-login) action is used.

```yaml
- uses: magneticio/vamp-actions/docker-logout@master
  id: logout
```

Refer to the [action metadata file](https://github.com/magneticio/vamp-actions/blob/master/docker-logout/action.yml) for details about all the inputs.
