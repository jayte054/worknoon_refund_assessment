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
git clone https://github.com/jayte054/worknoon_refund_assessment.git
cd worknoon-ai-refund-assessment
cp .env.example .env
docker-compose up --build


#Project Architecture

┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                      │
│  /customers   → customer list + orders modal                    │
│  /support     → refund request form                             │
│  /dashboard   → admin view of all requests + reasoning logs     │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP (axios)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (NestJS + TypeORM)                 │
│                                                                 │
│  RefundsController                                              │
│      │                                                          │
│      ▼                                                          │
│  RefundsService   ← the orchestrator                            │
│      │                                                          │
│      ├──► OrdersService      → load order + customer            │
│      │                                                          │
│      ├──► AiService.classify()    → { intent, reason, flags }   │
│      │        │                                                 │
│      │        ▼                                                 │
│      │   (OpenAI API — structured JSON output)                  │
│      │                                                          │
│      ├──► PolicyEngine.evaluate() → { decision, rule trace }    │
│      │   (pure functions — no DB, no HTTP, no LLM)              │
│      │                                                          │
│      └──► AiService.draftResponse() → customer-facing text      │
│                                                                 │
│      ▼                                                          │
│  RefundRequestRepository → persist the audit record             │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
                    ┌────────────────────┐
                    │  Postgres          │
                    │  - customers       │
                    │  - orders          │
                    │  - refund_requests │
                    └────────────────────┘

#Project Structure

worknoon-ai-refund-assessment/
├── docker-compose.yml          # One-command startup
├── .env.example                # Environment template
├── README.md                   # This file
│
├── backend/                    # NestJS API
│   ├── Dockerfile
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── modules/
│   │   │   ├── customer/       # Customer entity, service, controller
│   │   │   ├── orders/         # Order entity, service, controller
│   │   │   └── refunds/        # Refund entity, service, controller
│   │   ├── policy/             # PolicyEngine — pure decision logic
│   │   ├── ai/                 # AiService — LLM wrapper
│   │   └── scripts/
│   │       ├── seed.ts         # Seed entry point
│   │       ├── data-source.ts  # Shared TypeORM DataSource
│   │       └── fixtures/       # 15 customers + 15 orders
│   └── package.json
│
└── frontend/                   # Next.js app
    ├── Dockerfile
    ├── app/
    │   ├── customers/          # Customer list + orders modal
    │   ├── support/            # Refund request form
    │   └── dashboard/          # Support admin view
    ├── lib/
    │   ├── api.ts              # Backend API client
    │   ├── interface.ts        # Shared types
    │   └── utils.tsx           # Date formatting
    └── package.json