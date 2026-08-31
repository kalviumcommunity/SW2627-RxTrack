# RxTrack GCP Deployment Notes

## Project Setup

RxTrack will be deployed using Google Cloud Platform (GCP).

Planned services:

- Google Cloud Run - Backend API
- Google Cloud Run - Frontend
- Cloud SQL / PostgreSQL - Database

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

## Notes

Actual production deployment will be completed during the deployment phase of the RxTrack MVP sprint.