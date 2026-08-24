# NetSage AI 🌐⚡
> **AI-Assisted Network Troubleshooting Helper with Human Review for Cisco Packet Tracer Labs**

[![Cisco Project](https://img.shields.io/badge/Cisco-Confidential%20Project%202-005073?style=flat-square&logo=cisco)](https://www.cisco.com)
[![Python Rule Checker](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white)](python/rule_checker.py)
[![React Dashboard](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)](app)
[![Responsible AI](https://img.shields.io/badge/Safety-Human--in--the--Loop-10b981?style=flat-square)](docs/responsible_ai_log.md)

---

## 📌 Project Overview
Junior network engineers often struggle to connect raw Cisco network symptoms (e.g. *"PC has IP address but cannot reach server"*) to the true underlying root cause across OSI Layers 1–7.

**NetSage AI** is a complete AI-assisted troubleshooting system for Cisco Packet Tracer lab problems. It analyzes symptoms, topology notes, and `show` command outputs, executes deterministic Python rule checking, generates evidence-backed AI diagnoses, and **always mandates a human engineer review before accepting any fix**.

---

## 📁 Repository Structure & Deliverables

```
netsage-ai/
├── dataset/
│   ├── cases.csv                # 30 Packet Tracer troubleshooting cases (CSV format)
│   └── cases.json               # Full JSON dataset with show command outputs
├── prompts/
│   ├── diagnose_prompt.md       # Master AI diagnosis prompt template (JSON output + few-shot examples)
│   └── helper_prompts.md        # Auxiliary prompts for rule validation & CLI fix generation
├── python/
│   ├── rule_checker.py          # Deterministic Python script for detecting IP, mask, VLAN, ACL & NAT errors
│   └── test_cases.py            # Unit test suite for Python rule engine
├── docs/
│   └── responsible_ai_log.md    # Responsible AI audit log (5 human correction scenarios documented)
└── app/                         # Modern React + Vite Dashboard & Packet Tracer CLI Simulator
    ├── src/
    │   ├── components/          # React UI components (Header, CaseSelector, RuleChecker, HumanReview, Dashboard, etc.)
    │   ├── data/                # Embedded lab dataset and audit logs
    │   └── utils/               # In-browser deterministic rule checker engine
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Quick Start Guide

### 1. Run Deterministic Python Rule Checker & Unit Tests
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/netsage-ai.git
cd netsage-ai

# Run Python Rule Checker on all 30 lab cases
python python/rule_checker.py

# Run Python Unit Test Suite
python python/test_cases.py
```

### 2. Run Interactive Web Dashboard & CLI Simulator
```bash
# Navigate to web app directory
cd app

# Install dependencies
npm install

# Launch local development server
npm run dev
```
Open [http://localhost:3000/](http://localhost:3000/) in your browser.

---

## 📊 Summary of 30 Packet Tracer Cases
The dataset covers 30 realistic lab scenarios across 8 core network fault domains:
1. **VLAN & Trunking** (Native VLAN mismatch, trunk pruning, DTP negotiation)
2. **IP & Gateway** (Subnet mask mismatch, default gateway error, IP address conflicts, interface shutdown)
3. **DHCP & DNS** (Helper address missing, scope exhaustion, wrong DNS server IP, disabled DHCP service)
4. **Routing Protocols** (Missing default route `0.0.0.0 0.0.0.0`, OSPF area mismatch, EIGRP AS mismatch, passive interface)
5. **Access Control Lists (ACL)** (Implicit deny blocking HTTPS, wrong wildcard mask, line order error, wrong interface direction)
6. **NAT / PAT** (Missing `ip nat inside`, NAT pool ACL missing subnets, static NAT IP typo)
7. **Wireless & Security** (WPA2 key case sensitivity mismatch, guest VLAN isolation failure)

---

## 🛡️ Responsible AI & Human Oversight
In compliance with Cisco Responsible AI Principles, **NetSage AI enforces mandatory Human-in-the-Loop (HITL) review**:
- **Accepted**: Reviewer approves AI fix without modifications.
- **Edited**: Reviewer overrides fix (e.g., correcting inverted wildcard mask syntax or ACL direction).
- **Rejected**: Reviewer rejects hallucinated diagnoses (e.g. AI confusing Layer 2 VLAN pruning with Layer 3 OSPF routing).

See [responsible_ai_log.md](docs/responsible_ai_log.md) for full audit notes on 5 documented correction scenarios.

---

## 📜 License
Cisco Confidential - Academic & Network AI Project
