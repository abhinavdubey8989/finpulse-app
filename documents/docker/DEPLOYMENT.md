# FinPulse App - Kubernetes Deployment Guide

## Prerequisites
- Docker installed
- Kubernetes cluster running (minikube, kind, or cloud provider)
- kubectl configured

## Building the Docker Image

```bash
# Build the Docker image
docker build -t finpulse-app:latest .

# Test locally (optional)
docker run -p 8080:80 finpulse-app:latest

# Tag for your registry (update with your registry)
docker tag finpulse-app:latest <your-registry>/finpulse-app:latest

# Push to registry
docker push <your-registry>/finpulse-app:latest
```

## Deploying to Kubernetes

### 1. Update Configuration

Edit `k8s/configmap.yaml` to set your API URL:
```yaml
data:
  VITE_API_BASE_URL: "https://your-api-domain.com/api/v1"
```

### 2. Update Deployment Image

Edit `k8s/deployment.yaml` to use your image:
```yaml
image: <your-registry>/finpulse-app:latest
```

### 3. (Optional) Add Secrets

If you have sensitive data, update `k8s/secrets.yaml`:
```bash
# Create base64 encoded secret
echo -n "your-secret-value" | base64
```

Then add to the deployment's env section.

### 4. Apply Kubernetes Resources

```bash
# Apply all resources
kubectl apply -f k8s/

# Or apply individually
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## Verify Deployment

```bash
# Check deployment status
kubectl get deployments

# Check pods
kubectl get pods

# Check service
kubectl get services

# View logs
kubectl logs -f deployment/finpulse-app

# Describe pod for troubleshooting
kubectl describe pod <pod-name>
```

## Accessing the Application

### Port Forward (for testing)
```bash
kubectl port-forward service/finpulse-app-service 8080:80
```
Then access at http://localhost:8080

### LoadBalancer (if enabled)
```bash
kubectl get service finpulse-app-lb
```
Use the EXTERNAL-IP to access the application.

### Ingress (recommended for production)
Create an Ingress resource to expose the service with a domain name.

## Scaling

```bash
# Scale replicas
kubectl scale deployment finpulse-app --replicas=5

# Autoscaling (optional)
kubectl autoscale deployment finpulse-app --min=3 --max=10 --cpu-percent=80
```

## Updating the Application

```bash
# Build and push new image
docker build -t <your-registry>/finpulse-app:v2 .
docker push <your-registry>/finpulse-app:v2

# Update deployment
kubectl set image deployment/finpulse-app finpulse-app=<your-registry>/finpulse-app:v2

# Or edit the deployment.yaml and reapply
kubectl apply -f k8s/deployment.yaml
```

## Cleanup

```bash
# Delete all resources
kubectl delete -f k8s/

# Or delete individually
kubectl delete deployment finpulse-app
kubectl delete service finpulse-app-service
kubectl delete configmap finpulse-app-config
kubectl delete secret finpulse-app-secrets
```

## Files Created

- `Dockerfile` - Multi-stage build for production
- `.dockerignore` - Excludes unnecessary files from build
- `nginx.conf` - Nginx configuration for serving SPA
- `k8s/configmap.yaml` - Application configuration
- `k8s/secrets.yaml` - Sensitive data storage
- `k8s/deployment.yaml` - Kubernetes deployment (3 replicas)
- `k8s/service.yaml` - Service to expose the application

## Notes

- The deployment uses 3 replicas for high availability
- Health checks are configured on `/health` endpoint
- Resource limits are set (adjust based on your needs)
- The service is ClusterIP by default (internal only)
- Uncomment LoadBalancer section in service.yaml for external access
