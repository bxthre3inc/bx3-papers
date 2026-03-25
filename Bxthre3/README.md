# Bxthre3 Inc — Projects

R&D Studio &amp; Holdings company focused on Infrastructure, Agronomics, Recycling, and Robotics.

## Folder Structure

```
Bxthre3/
├── projects/           # All active R&D projects (each has its own folder)
├── INBOX/              # Intra-agent communications and escalations
├── agents/            # Agent definitions, status, and logs
├── docs/               # Reserved for cross-project documentation
└── README.md           # This file
```

## Projects

Each project lives in its own folder under `projects/` following the naming convention `the-{project-name}-project/`. Prefixless folders (e.g., `mcp-mesh/`, `slv-mesh/`) are established internal projects.

| Project | Folder | Description | Status |
|---------|--------|-------------|--------|
| **Irrig8** | `the-irrig8-project/` | Precision Agriculture OS — deterministic irrigation operating system leveraging satellite, sensor, and API data | Active |
| **Valley Players Club** | `the-valleyplayersclub-project/` | Skills-and-slots sweepstakes gaming platform | Active |
| **RAIN** | `the-rain-project/` | Regulatory Arbitrage Intelligence Network — AI-powered compliance gap mapping | Beta Live |
| **AgentOS** | `the-agentos-project/` | Mobile-first agentic computing platform | Active |
| **AgentOS Native** | `the-agentos-native/` | Native Android APK for AgentOS | Active |
| **MCP Mesh** | `mcp-mesh/` | MCP interoperability mesh protocol for agent communication | Active |
| **SLV Mesh** | `slv-mesh/` | San Luis Valley sensor mesh infrastructure | Pilot |
| **Zoe** | `the-zoe-project/` | Conversational AI interface (pending merge into AgentOS) | Review |
| **Antigravity** | `the-antigravity-project/` | Purpose under review | Review |
| **ARD** | `the-ard-project/` | Purpose under review — no README | Review |
| **Trenchbabys** | `the-trenchbabys-project/` | Purpose under review — no README | Review |
| **Real Estate Arbitrage** | `the-realestate-arbitrage-project/` | Purpose under review — no README | Review |

## Project Status Definitions

- **Active:** Full development and operations underway
- **Beta Live:** Deployed and generating value, iterative improvements
- **Pilot:** Early-stage testing in controlled environment
- **Review:** Needs owner assignment and scope definition or archiving

## Project Conventions

- Each project folder should contain a `README.md` with project overview
- Route paths follow `/projects/{slug}` for public projects
- Private/internal projects may have custom routes
- APK outputs live inside their project directory (not at workspace root)

## Website

Public presence: [brodiblanco.zo.space](https://brodiblanco.zo.space)
- Homepage displays active project portfolio
- Investor portal at `/invest`
- Individual project pages at `/projects/{slug}`

## Brand Note

**Irrig8** is the canonical product name. All materials should reference Irrig8 only.

---

*Built by Bxthre3 Inc — Infrastructure, Agronomics, Recycling, Robotics*
