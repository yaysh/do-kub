
# Challenge: Deploy a scalable SQL database cluster
>When deploying a database on Kubernetes, you have to make it redundant and scalable. You can rely on database management operators like KubeDB or database-specific solutions like Kubegres for PostgreSQL or the MySQL Operator for MySQL. 

## Requirements
Create a Kubernetes cluster on [Digital Ocean](https://www.digitalocean.com/products/kubernetes/)  
Install the [NGINX Ingress Controller](https://marketplace.digitalocean.com/apps/nginx-ingress-controller) on your cluster.  
A record which will host the backend and client.

### NOTE
I created a record on the following [page](https://cloud.digitalocean.com/networking/domains/). Add the hostnames you want for your client and under "Will direct to" choose the Load balancer that was created when you installed the NGINX Ingress Controller.

## Deploy PostgreSQL to Kubernetes Cluster using Kubegres

The documentation found [here](https://www.kubegres.io/doc/getting-started.html) makes it simple to deploy a PostgreSQL database to Kubernetes. I will quickly run through the commands to get it up and running.

Create a file named postgres-secret.yaml containing the following:
```
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
  namespace: default
type: Opaque
stringData:
  superUserPassword: <superUserPassword>
  replicationUserPassword: <replicationPassword>  
  dokubUser: <user>
  dokubPassword: <password>
  dokubDatabase: <database>
  dokubPort: <port>
  dokubHost: <service>

```
The dokub- secrets will be used by our client applications to access the data.  
The defined user in the postgres-config file gains access to the database.  
Furthermore, the config-file has been altered so that a database and table are created on startup (unless they exist).  

There is a slight modification we need to make to the Kubegres-file from the documentation. Swap the database lines with the following:
``` 
database:
    size: 1Gi
    storageClassName: do-block-storage
    volumeMount: /var/lib/postgresql/data
```
The storageClassName can be found by running the following line
```
kubectl get sc
```
Now run the following commands
```
kubectl apply -f https://raw.githubusercontent.com/reactive-tech/kubegres/v1.14/kubegres.yaml
kubectl apply -f postgres-secret.yaml
kubectl apply -f postgres-config.yaml
kubectl apply -f postgres.yaml
```
## Deploy backend    
API calls will be forwarded in the client ingress. Check client-ingress.yaml to see how
```
kubectl apply -f backend.yaml
```

## Deploy client
Inside client-ingress.yaml, change the following 
>  - host: ""
to point towards the domain you want your backend to live on. An example can be client.mydomain.com

Inside the client-ingress we also forward the calls from the frontend to the backend service. This will allow the frontend to communicate with the backend in the following way (so the baseurl is not needed)
```
fetch("/api/messages")
```
in our frontend and the request will be redirected correctly.
```
- pathType: Prefix
path: /api/
backend:
  service: 
    name: backend-service
    port:
      number: 3000

```

After you've changed the domain you can use the following commands to deploy the client
```
kubectl apply -f client-ingress.yaml
kubectl apply -f client.yaml
```

## Result
You should be able to access your page on the record you defined above, eg client.domain.com
It should look like the following:
![Screenshot](1.png)
Add a new message and watch it append
![Screenshot](2.png)
### Comments
If you want to upload your own application you can do so by following these steps:

Upload an image to a repository (I used [docker hub](https://docs.docker.com/docker-hub/repos/))  
In the yaml file that contains Service and Deploy (eg backend.yaml and client.yaml in this repo) point to your uploaded image.  
In your ingress.yaml, point towards a subdomain that you create that is directed to your kubernetes cluster.  

If you want to test locally you can use docker-compose up in the root of this project.