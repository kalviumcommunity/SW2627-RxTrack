param(
  [Parameter(Mandatory = $true)] [string]$ProjectId,
  [string]$Region = "us-central1",
  [string]$BackendService = "rxtrack-api",
  [string]$FrontendService = "rxtrack-frontend"
)

$ErrorActionPreference = "Stop"
gcloud config set project $ProjectId
gcloud builds submit --tag "gcr.io/$ProjectId/$BackendService" --file backend/Dockerfile .
gcloud run deploy $BackendService --image "gcr.io/$ProjectId/$BackendService" --region $Region --allow-unauthenticated

$backendUrl = gcloud run services describe $BackendService --region $Region --format="value(status.url)"
gcloud builds submit --tag "gcr.io/$ProjectId/$FrontendService" frontend
gcloud run deploy $FrontendService --image "gcr.io/$ProjectId/$FrontendService" --region $Region --allow-unauthenticated --set-env-vars "NEXT_PUBLIC_API_URL=$backendUrl"

Write-Host "Backend: $backendUrl"
Write-Host "Frontend: $(gcloud run services describe $FrontendService --region $Region --format='value(status.url)')"