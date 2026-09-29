# Refund Processing System

An AI-assisted refund decision system for e-commerce customer support.
Customers submit refund requests; the backend classifies them with an LLM,
evaluates them against a deterministic refund policy, and returns an
`approved`, `denied`, or `escalated` decision with a full audit trail.

Built for the WORKNOON Full Stack AI Integration Product Challenge.

---

## 1. Setup and Running

### Prerequisites

- **Docker Desktop** (macOS, Windows) or **Docker Engine + Docker Compose v2** (Linux)
- That's it. Node, Postgres, and everything else run inside the containers.

### Run the project

From the repository root:

```bash
git clone <your-repo-url>
cd worknoon-ai-refund-assessment
cp .env.example .env
docker-compose up --build