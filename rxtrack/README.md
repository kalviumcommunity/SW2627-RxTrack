# RxTrack - Prescription-to-Order Tracking System

##  Overview

**RxTrack** is a prescription-to-order tracking system for **Tata 1mg** that revolutionizes how doctors monitor patient medication compliance and how pharmacies manage prescription fulfillment.

###  Problem Solved
- Doctors lack visibility into whether patients actually fill their prescriptions
- Pharmacies waste 2.5+ hours daily managing prescriptions manually
- No data on medication compliance patterns per medicine
- Manual processes prone to errors and double-filling

###  Solution
A unified digital platform where:
- **Doctors** upload prescriptions and monitor real-time fill rates
- **Pharmacies** manage prescriptions with a digital queue and one-click fulfillment
- **Tata 1mg** gains competitive advantage with compliance analytics & doctor insights

---

##  Key Features

### For Doctors
-  Upload prescriptions digitally
-  Track prescription fill status in real-time
-  View fill-rate analytics per medicine
-  Understand patient medication compliance patterns
-  Generate compliance reports

### For Pharmacies
-  Digital queue management system
-  One-click prescription marking as filled
-  Double-fill prevention mechanism
-  Real-time order tracking
-  Reduced manual workload (saves 2.5 hrs/day)

### For Tata 1mg
-  First Indian pharmacy with doctor compliance insights
-  Attract more doctors to the platform
-  Data-driven medicine recommendations
-  Unlock ₹30L+/month incremental revenue
-  Competitive market advantage

---

##  Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js (React) |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Cloud** | Google Cloud Platform (GCP) |
| **CI/CD** | GitHub Actions |
| **Version Control** | Git & GitHub |

---

##  Project Structure

```
SW2627-RxTrack/
├── pages/
│   ├── api/
│   │   ├── doctors/
│   │   ├── pharmacies/
│   │   ├── prescriptions/
│   │   └── analytics/
│   ├── doctor/
│   ├── pharmacy/
│   └── index.js
├── components/
│   ├── DoctorDashboard/
│   ├── PharmacyQueue/
│   ├── AnalyticsPanel/
│   └── common/
├── prisma/
│   └── schema.prisma
├── public/
├── styles/
├── .env.local
├── package.json
├── next.config.js
└── README.md
```

---

##  Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- PostgreSQL database
- GCP account (for deployment)

### 1. Clone the Repository
```bash
git clone https://github.com/kalviumcommunity/SW2627-RxTrack.git
cd SW2627-RxTrack
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rxtrack"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000"

# GCP (for production)
GCP_PROJECT_ID="your-gcp-project-id"
GCP_REGION="us-central1"
```

### 4. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

##  Git Workflow & Branch Strategy

### Branch Naming Convention
- `main` - Production-ready code (protected branch)
- `feature/feature-name` - New features (e.g., `feature/doctor-dashboard`)
- `fix/bug-name` - Bug fixes (e.g., `fix/double-fill-prevention`)

### Workflow Steps
1. **Pull latest code** from `main`
2. **Create a feature branch** from `main`
3. **Commit changes** with clear messages
4. **Push to GitHub**
5. **Create Pull Request (PR)** to `main`
6. **Code review** by team members
7. **Merge** after approval
8. **Deploy** to production

### Example Workflow
```bash
# 1. Update main branch
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/doctor-dashboard

# 3. Make changes and commit
git add .
git commit -m "feat: add doctor dashboard with analytics"

# 4. Push to GitHub
git push origin feature/doctor-dashboard

# 5. Create PR on GitHub (via web interface)
# 6. After approval, merge to main
```

---

##  Pull Request Guidelines

### PR Title Format
```
[TYPE]: Brief description

Types: feat, fix, docs, style, refactor, test, chore
Example: feat: add prescription upload API endpoint
```

### PR Description Template
```markdown
## Description
Brief explanation of what this PR does

## Changes
- Change 1
- Change 2
- Change 3

## Testing
How was this tested?

## Screenshots
(If applicable)
```

### Review Checklist
-  Code follows project conventions
-  Tests are passing
-  No breaking changes
-  Documentation updated if needed
-  No hardcoded secrets or credentials

---

## Deployment

### Deploy to GCP Cloud Run
```bash
# Build Docker image
docker build -t rxtrack:latest .

# Push to GCP Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/rxtrack

# Deploy to Cloud Run
gcloud run deploy rxtrack --image gcr.io/PROJECT_ID/rxtrack
```

### GitHub Actions CI/CD
Automated workflows run on every push:
-  Lint & format checking
-  Unit tests
-  Integration tests
-  Build verification
-  Automated deployment (on merge to main)

---

##  Team

| Name | Role | Responsibilities |
|------|------|------------------|
| Jaishal | Project Admin | Overall coordination, GitHub management, frontend development |
| Sunny | Backend Developer | API development, Prisma schema, database logic |
| Sehaj | (Role TBD) | (To be assigned) |

---

##  Database Schema Overview

### Core Tables
- **Doctors** - Doctor profiles & credentials
- **Pharmacies** - Pharmacy details
- **Prescriptions** - Prescription records
- **Orders** - Fill orders & status tracking
- **Analytics** - Compliance & fill-rate metrics

*(Detailed schema in `prisma/schema.prisma`)*

---

##  Security Considerations

-  Authentication required for all routes
-  Role-based access control (Doctor/Pharmacy/Admin)
-  Input validation on all APIs
-  Environment variables for secrets
-  HTTPS in production
-  SQL injection prevention (via Prisma ORM)
-  Rate limiting on API endpoints

---

##  Project Timeline

- **Start Date:** 25-08-2026 {Development Starts}
- **Target Submission:** September 2026
- **Sprint Duration:** 25 days


---

##  Contributing Guidelines

1. **Create an issue** before starting work on new features
2. **Reference the issue** in your commits and PRs
3. **Write clear commit messages** (e.g., `git commit -m "feat: add prescription endpoint"`)
4. **Keep PRs small & focused** (easier to review)
5. **Respond to review feedback** promptly
6. **Squash commits** before merging if needed

---

##  Reporting Issues

Found a bug? Please create an issue with:
- Clear title
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable

---

##  Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [GCP Documentation](https://cloud.google.com/docs)
- [GitHub Actions Guide](https://docs.github.com/en/actions)

---

##  Support

For questions or issues:
- Create a GitHub issue
- Contact the project admin (Jaishal Patel)
- Team discussions in project channels


##  Checklist Before Submission

- [ ] All features implemented
- [ ] Unit tests passing (>80% coverage)
- [ ] Integration tests passing
- [ ] Code reviewed by team
- [ ] Documentation complete
- [ ] Deployed to GCP
- [ ] GitHub Actions CI/CD working
- [ ] Security audit passed
- [ ] Performance optimized
- [ ] User acceptance testing done

---

**Last Updated:** August 2026  
**Status:** In Development  
**Maintained By:** Team RxTrack 