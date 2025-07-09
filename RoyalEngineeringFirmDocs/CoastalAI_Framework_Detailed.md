
# **RoyalAI / MarshFlow**  
### *End-to-End Framework & Delivery Playbook (Deep-Dive Edition)*  

This document turns the high-level outline into a complete *execution blueprint*. It covers architecture, code scaffolding, infrastructure-as-code, CI/CD, security, SLAs, training, sales collateral, and repeatable delivery. Copy/paste the snippets and use the checklists to stand up the entire service.

---

## 0. Naming & Branding

| Candidate | Tagline | Domain | Trademark Check |
|-----------|---------|--------|-----------------|
| **MarshFlow** | “Flow-through AI for Coastal Engineers” | marshflow.ai | USPTO search required |
| **SettleSense** | “Predict. Settle. Succeed.” | settlesense.io | — |
| **RoyalAI** | “Automation & Insight for Shoreline Projects” | royal.ai | premium |

*Pick one and secure:*  
```bash
aws route53 register-domain --domain-name .ai --duration-in-years 3
```

---

## 1. Product Framework (Modules → Micro-services)

| # | Module | Tech Stack | Code Scaffolding | Primary Artifacts |
|---|--------|------------|------------------|-------------------|
| 1 | **Data Extraction Engine** | Python 3.12, Tesseract OCR 5, spaCy v3, FastAPI 1.5 | `/services/extractor` | `extractor.py`, `Dockerfile`, `extractor.proto` |
| 2 | **Survey Intelligence** | PostGIS 16, geopandas 0.15, scikit‑learn 1.5 | `/services/survey_ai` | `mudline_analyzer.py`, `kriging.py` |
| 3 | **Curve Analytics & Forecasting** | PyTorch 2.3, Prophet 1.2, mlflow 2.x | `/services/forecast` | `lstm.py`, `model_registry.yaml` |
| 4 | **Document Management** | Elasticsearch 8.x, Airflow 2.9, MinIO S3 | `/services/doc_hub` | `ingest_dag.py`, `mapping.json` |
| 5 | **Dashboards** | Dash 2.16, Plotly 5, Auth0 | `/frontend/dash_app` | `app.py`, `dash_layout.py` |
| 6 | **Integration Layer** | gRPC 1.63 gateway, Kafka 3.7 | `/gateway` | `gateway.proto`, `docker-compose.yml` |

```
marshflow/
├── services/
│   ├── extractor/
│   ├── survey_ai/
│   ├── forecast/
│   └── doc_hub/
├── gateway/
├── frontend/
├── infra/
│   ├── terraform/
│   └── helm/
├── .github/workflows/
└── playbooks/
```

---

## 2. Delivery Tiers (Contracts, SOW, Milestones)

### 2.1 Tier 1 – Pilot / PoC

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Kick‑off | Day 0 | Signed SOW |
| Data Sample | Day 3 | 1 GB PSDDF + RTK |
| Build | Day 4–18 | Extractor + Quick Dash |
| Review | Day 19 | Demo + KPI |
| Handoff | Day 21 | PoC report, containers |

*Fee:* **$25 k** – exit when ≥ 75 % data‑entry reduction.

### 2.2 Tier 2 – Workflow Automation Platform

| Sprint | Feature | Acceptance |
|--------|---------|------------|
| S1 | Parallel extractor | 10 k docs < 2 h |
| S2 | Survey QC dash | < 5 % outliers |
| S3 | Forecast API | MAPE ≤ 7 % |
| S4 | Doc search | < 0.5 s p95 |
| S5 | Hardening | SOC2 logs, SSO |

*Budget:* **$120 k–160 k**

### 2.3 Tier 3 – Managed Service

| Item | Bronze | Silver | Gold |
|------|--------|--------|------|
| Uptime | 99 % | 99.5 % | 99.9 % |
| Support | 72 h email | 24 h Slack | 4 h phone |
| Retrain | Annual | Semi‑annual | Quarterly |
| Price | $3 k/mo | $5 k/mo | $8 k/mo |

---

## 3. Infrastructure-as-Code (AWS Example)

```hcl
module "vpc" { source="terraform-aws-modules/vpc/aws" name=var.project cidr="10.42.0.0/16" }

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  cluster_version = "1.30"
  vpc_id  = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  eks_managed_node_groups = {
    default = { instance_types = ["m7i.large"], desired_size = 3 }
  }
}

module "rds_postgis" {
  source = "terraform-aws-modules/rds/aws"
  engine = "postgres"
  engine_version = "16.2"
  instance_class = "db.t3.medium"
  parameter_group_name = "postgis-16"
}
```

Helm values (`infra/helm/extractor/values.yaml`):

```yaml
image: { repository: ghcr.io/marshflow/extractor, tag: "1.0.0" }
resources:
  limits: { cpu: 2, memory: 4Gi }
env:
  - { name: TESSDATA_PREFIX, value: /usr/share/tessdata }
persistence: { enabled: true, size: 20Gi }
```

---

## 4. CI/CD (GitHub Actions)

```yaml
name: build-push
on: { push: { branches: [main] } }

jobs:
  build:
    runs-on: ubuntu-latest
    strategy: { matrix: { service: [extractor, survey_ai, forecast, doc_hub] } }
    steps:
    - uses: actions/checkout@v4
    - run: docker build -t ghcr.io/${{ github.repository }}/$SERVICE:${{ github.sha }} ./services/$SERVICE
      env: { SERVICE: ${{ matrix.service }} }
    - run: docker push ghcr.io/${{ github.repository }}/$SERVICE:${{ github.sha }}
      env: { SERVICE: ${{ matrix.service }} }
    - uses: azure/setup-helm@v3
    - run: |
        helm upgrade --install $SERVICE infra/helm/$SERVICE           --set image.tag=${{ github.sha }} --kubeconfig ${{ secrets.KUBECONFIG }}
      env: { SERVICE: ${{ matrix.service }} }
```

Promotion: `main` → staging (auto) → prod (tag release via Argo CD).

---

## 5. Security & Compliance

| Layer | Control | Tool |
|-------|---------|------|
| AuthN | OIDC SSO | Auth0 |
| AuthZ | Role/JWT | FastAPI |
| Data | AES‑256 rest | RDS, S3 KMS |
| Network | PrivateLink | AWS NLB |
| CI/CD | Image signing | cosign |
| Logs | Immutable | Loki |

SOC2 mapping in `playbooks/compliance/soc2.md`.

---

## 6. Implementation Snippets

### Data Extraction

```python
@app.post("/extract")
async def extract(file: UploadFile):
    img = await file.read()
    text = pytesseract.image_to_string(img, lang="eng")
    return {"data": parse_settle3(text)}
```

### Survey Kriging

```python
OK = ok.OrdinaryKriging(x, y, z, variogram_model="spherical")
zhat, _ = OK.execute("grid", gridx, gridy)
```

QC flag: deviation > 0.3 ft.

### Forecast MLflow Spec

```yaml
experiment: settlement
stages:
  - preprocess
  - train: { params: { hidden_size: 64, epochs: 50 } }
  - validate: { metrics: [MAPE, RMSE] }
```

---

## 7. API & UI

gRPC contract (`gateway.proto`) plus React+Dash front‑end embedded via iframe. Auth0 token → Envoy → gRPC‑Gateway → micro‑services.

---

## 8. Playbooks & Templates

- `onboarding.md` – VPN, credentials
- `runbooks/` – extractor restart, DB failover
- `templates/` – SOW, MSA, ROI xlsx

---

## 9. Observability

Prometheus + Grafana + Loki + Tempo. Example alert:

```
sum(rate(http_server_errors[5m])) / sum(rate(http_requests_total[5m])) > 0.01
```

---

## 10. SLA

| Severity | Response | Resolution |
|----------|----------|------------|
| Sev 1 | 15 min | 4 h |
| Sev 2 | 1 h | 24 h |

---

## 11. Sales Collateral

- One‑pager (`onepager.md` → Pandoc PDF)
- Demo video storyboard
- ROI calculator (`roi.xlsx`)

---

## 12. Gantt (8 weeks)

```
Week 1-2: Infra + Extractor
Week 3-4: Survey AI + Forecast
Week 5-6: Dashboards + Integrations
Week 7-8: Hardening + Launch
```

---

## 13. Legal

Client gets usage license; vendor retains algorithms. Indemnity cap = fees paid.

---

## 14. Future Roadmap

- Hydrodynamic model ingestion
- RL‑based design optimization
- Word report auto‑drafting
- Edge RTK preprocessing

---

### ✅ Master Checklist

- [ ] Terraform stack applied
- [ ] Helm green
- [ ] Extractor HP test passed
- [ ] Forecast MAPE ≤ 7 %
- [ ] Dash behind SSO
- [ ] Alerts active
- [ ] Pilot sign‑off
