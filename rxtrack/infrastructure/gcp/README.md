# RxTrack GCP Setup Notes

These steps describe the MVP deployment setup. Keep secrets in Google Secret
Manager or Cloud Run environment configuration; never commit production values.

## Project Setup

RxTrack will be deployed using Google Cloud Platform (GCP).

Planned services:

- Google Cloud Run - Backend API
- Google Cloud Run - Frontend
- Cloud SQL / PostgreSQL - Database

Set the active project before deploying:

```bash
gcloud auth login
gcloud config set project YOUR_GCP_PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com sqladmin.googleapis.com artifactregistry.googleapis.com
```

Choose a region and record it for the deployment team:

```bash
gcloud config set run/region us-central1
```

## Environment Templates

For local development, copy the repository template files and replace only the
local values:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
```

The local database is provided by `docker compose up -d postgres`. The root
`.env.example` uses the same credentials as the Compose service.

## Backend Deployment

The backend will be containerized using Docker and deployed to Google Cloud Run.

Before deployment:

1. Configure the GCP project.
2. Enable Cloud Run and required APIs.
3. Configure database connection variables.
4. Build the backend Docker image.
5. Deploy the image to Cloud Run.
6. Verify the API endpoints.

## Frontend Deployment

The frontend will be deployed separately to Google Cloud Run.

The frontend will use the deployed backend API URL through an environment variable.

## Environment Variables

Environment-specific values must be stored outside Git.

Use `.env.example` as the template for required variables.

Do not commit passwords, API keys, JWT secrets, or database credentials.

## Deployment Verification

After deployment, verify:

- Backend health endpoint responds successfully.
- Frontend loads successfully.
- Frontend can communicate with backend.
- Database connection works.
- Authentication works.

## MVP Verification Checklist

- `gcloud config get-value project` returns the intended project.
- PostgreSQL/Cloud SQL is reachable from the backend.
- Backend health and authentication endpoints respond successfully.
- Frontend loads and uses the deployed backend URL.
- No production secrets are present in Git.