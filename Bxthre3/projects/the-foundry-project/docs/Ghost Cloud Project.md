# Project Spec: Ghost Cloud (v0.2)

**Code Name:** Ghost Cloud

**Classification:** Bxthre3 Proprietary / Strategic Asset

**Objective:** Orchestrate a high-availability \"Virtual AWS\" by
federating 120+ free-tier SaaS providers into a unified,
self-propagating mesh for Agentic and Irrig8.

## 1. System Architecture: The 6-Pillar Uniform Mesh

The infrastructure is divided into six functional pillars. To ensure
\"Hot-Swappable\" reliability, every node within a pillar must run a
**Uniform Environment** (identical Docker/Wasm images).

  ---------------------------------------------------------------------------
  **Pillar**        **Responsibility**   **Uniform Env**    **Target
                                                            Capacity**
  ----------------- -------------------- ------------------ -----------------
  **1. Edge         Global Routing &     TypeScript/Edge    20 Providers (80M
  Gateway**         Ingress                                 req/mo)

  **2. Persistent** Sentinel & Registry  Docker (Always-On) 20 Providers
                                                            (High-Uptime)

  **3. Ephemeral**  Stateless Logic /    Docker             20 Providers
                    Workers              (Scale-to-0)       (Burstable)

  **4. State**      Spatial/Vector DB    Postgres/PostGIS   20 Providers
                                                            (60GB+ SQL)

  **5. Message      Node Sync & Task     HTTP/PubSub        20 Providers (15M
  Bus**             Queues                                  msg/mo)

  **6. Identity**   Mesh Encryption &    JWT/Headscale      20 Providers
                    Auth                                    (100k MAUs)
  ---------------------------------------------------------------------------

## 2. The Expansion Engine: \"The Recruiter\"

Ghost Cloud is designed to grow programmatically, finding its own
\"limbs\" across the internet.

### A. Automated Discovery

-   **Scraper:** An LLM-augmented crawler that identifies new SaaS
    > providers offering free tiers with Docker support and \>512MB RAM.

-   **Identity Provisioning:** Automated generation of
    > \*@ghost.bxthree.com emails and programmatic SMS verification
    > bonding via API (Twilio/5Sim).

### B. \"Ghost-Sitter\" Enrollment (Cyborg-in-the-Loop)

-   **Execution:** Playwright handles the bulk of the signup flow (form
    > filling, email verification).

-   **Human Handover:** If a **CAPTCHA** or 403 challenge is
    > encountered:

    1.  The script pauses and triggers a notification
        > (Telegram/Discord).

    2.  The browser window is streamed to the **Ghost Dashboard** via
        > noVNC.

    3.  The User (Babysitter) solves the challenge manually.

    4.  The script detects completion, retrieves API keys, and joins the
        > node to the **Tailscale Mesh**.

## 3. Operational Protocols

### The Sentinel (Registry & Traffic Scientist)

-   **Global Map:** Maintains a real-time registry of all 120+ nodes,
    > their Tailscale IPs, and current month-to-date (MTD) usage.

-   **Deterministic Routing:** When a node reaches **90% of its free
    > quota**, the Sentinel automatically re-routes traffic to the next
    > available \"Fresh\" node in the pillar.

### The Ghost Sidecar

-   Every compute node must run the **Tailscale Sidecar** for encrypted
    > mesh communication.

-   Nodes must report a \"Pulse\" (CPU, RAM, Quota Status) every 60s.
    > Failure to report for 180s results in an automatic \"Mark as
    > Offline\" status in the Registry.

## 4. The Void Protocol (Kill Code)

A cryptographic \"Cyanide Pill\" designed to dismantle the unkillable.

### A. The Detonator

-   Triggered by a 256-bit **Entropy Key** (stored in
    > ghost_detonator.py).

-   The Sentinel verifies the SHA-256 signature of the key before
    > broadcasting the VOID signal.

### B. Apoptosis Sequence

Upon receiving a verified VOID command, every node executes:

1.  **Secure Scrub:** Overwrites all local caches and temporary
    > directories with zeros.

2.  **Account Deletion:** Uses stored provider API keys to
    > programmatically delete the deployment and the host account.

3.  **Mesh Disconnect:** Logs out of Tailscale and self-terminates the
    > container.

## 5. Deployment Guidelines for Devs

-   **Network Mode:** All app containers must use network_mode:
    > service:tailscale.

-   **Statelessness:** No compute node is permitted to store persistent
    > data locally. All state must be pushed to the **State &
    > Persistence** pillar or the **Message Bus**.

-   **Anonymization:** Use residential proxy rotation for all
    > \"Recruiter\" signup activities to avoid IP-based ban waves.

**Status:** INCUBATION ACTIVE

**Security Level:** CLASSIFIED / BXTHREE PROPRIETARY
