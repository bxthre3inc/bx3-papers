# Antigravity IDE Roadmap
**Status:** Not Started | Concept Phase

---

## What is Antigravity IDE?

**Antigravity IDE** = The counterpoint to Zo. While Zo is the AI assistant that acts on your behalf, Antigravity is the **development environment where humans and AI co-create**.

| Zo | Antigravity IDE |
|---|---|
| Acts on your behalf | You act directly |
| Conversational interface | Code-first interface |
| Manages automations | Writes automations |
| Uses tools | Creates tools |
| Responds to requests | Anticipates needs |

---

## Phase 1: Foundation (MVP)
**Goal:** Basic editor with AI pair programming

### Core Features
- [ ] Web-based code editor (Monaco/CM6)
- [ ] Real-time collaboration + cursors
- [ ] File tree with workspace browsing
- [ ] Terminal panel
- [ ] AI sidebar for chat/codegen

### AI Features
- [ ] `/prompt` command in editor
- [ ] Inline AI completions
- [ ] "Explain this code" hover
- [ ] AI-powered refactoring
- [ ] Natural language to code

### Integration Points
- [ ] MCP client to Zo (can call Zo tools)
- [ ] MCP server for IDEs (Cursor, VS Code can connect)
- [ ] Agentic MCP mesh peer

**Deliverable:** Web IDE at `antigravity-brodiblanco.zocomputer.io`

---

## Phase 2: Smart Workspace (P0)
**Goal:** IDE that understands your projects

### Context Awareness
- [ ] AST parsing for all supported languages
- [ ] Symbol navigation (go to definition)
- [ ] Project-wide search with AI context
- [ ] Dependency graph visualization
- [ ] Type inference assistance

### AI Deepening
- [ ] Code review mode
- [ ] Architecture suggestions
- [ ] Test generation
- [ ] Documentation generation
- [ ] Commit message suggestions

### Agent Integration
- [ ] Agentic agents as "smart cursors"
- [ ] Agents can edit files alongside you
- [ ] Agent suggestions appear as diffs
- [ ] Accept/reject agent changes

**Deliverable:** Context-aware IDE

---

## Phase 3: Multiplayer (P0)
**Goal:** Real-time team coding

### Synchronization
- [ ] CRDT-based document sync
- [ ] Operational transform fallback
- [ ] Cursor presence per user/agent
- [ ] Follow mode (follow someone's cursor)
- [ ] Voice chat integration

### Permissions
- [ ] Role-based access (viewer, editor, admin)
- [ ] File-level permissions
- [ ] Approval workflows for production files
- [ ] Agent permissions (which agents can edit what)

**Deliverable:** Team-ready IDE

---

## Phase 4: MCP Mesh Integration (P0)
**Goal:** Central node in 3-way mesh

### As Mesh Peer
- [ ] Serve tools to Zo and Agentic
- [ ] Consume tools from Zo and Agentic
- [ ] Context sync: open files, active file, cursor position
- [ ] Resource locking (file being edited)

### Specific Tools
- [ ] `ide_open_file` - Open file in IDE
- [ ] `ide_edit_file` - Edit with diff
- [ ] `ide_search` - Search across workspace
- [ ] `ide_run_terminal` - Execute in IDE terminal
- [ ] `ide_get_context` - Get current editor state

**Deliverable:** Mesh peer with 3-way sync

---

## Phase 5: Agentic Features (P1)
**Goal:** AI agents as first-class collaborators

### Agent Integration
- [ ] Agents appear as users in multiplayer
- [ ] Agent cursors visible in real-time
- [ ] Agent suggestions inline
- [ ] Agent execution logs
- [ ] Agent approval workflows

### Workflows
- [ ] "Draft PR with Agent" - Agent writes, you review
- [ ] "Pair program" - Agent suggests, you accept/reject
- [ ] "Code review" - Agent reviews before git push
- [ ] "Architecture session" - Agent sketches, you refine

**Deliverable:** Agents as teammates

---

## Phase 6: Deployment Integration (P1)
**Goal:** Edit → Deploy pipeline

### Build & Deploy
- [ ] Build button → runs in cloud
- [ ] Deploy to zo.space from IDE
- [ ] Deploy to render/fly from IDE
- [ ] Preview URLs generated
- [ ] Rollback from IDE

### Monitoring
- [ ] Live logs in IDE panel
- [ ] Error tracking integration
- [ ] Performance metrics
- [ ] Alert acknowledgment

**Deliverable:** End-to-end dev pipeline

---

## Phase 7: Advanced AI (P2)
**Goal:** AI that truly understands

### Deep Understanding
- [ ] Repo-wide semantic search
- [ ] Cross-file refactoring
- [ ] Architecture diagrams from code
- [ ] Automatic test discovery
- [ ] Flaky test identification

### Generation
- [ ] Full feature implementation from spec
- [ ] API endpoint scaffolding
- [ ] Frontend from backend types
- [ ] Documentation from code
- [ ] Deployment configs

**Deliverable:** AI as senior engineer

---

## Phase 8: Mobile & Desktop (P2)
**Goal:** Code anywhere

- [ ] PWA for mobile editing
- [ ] Electron desktop app
- [ ] VS Code extension (hybrid)
- [ ] Offline mode with sync
- [ ] Touch-optimized interactions

**Deliverable:** Multi-platform IDE

---

## Phase 9: Enterprise (P3)
**Goal:** Production at scale

- [ ] SSO/SAML integration
- [ ] Audit logging
- [ ] Compliance features
- [ ] Self-hosted option
- [ ] Enterprise support

**Deliverable:** Enterprise-ready IDE

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Editor | Monaco + Yjs or CodeMirror 6 |
| Backend | Bun + Hono + PartyKit |
| State | Yjs CRDTs + Redis |
| AI | Claude API + local models |
| Files | Inotify + WebSocket sync |
| Terminals | xterm.js + PTY |

---

## Integration Matrix

| Feature | Zo | Agentic | External |
|---------|----|---------|----------|
| File ops | ✅ | ✅ | MCP |
| Terminal | ✅ | ❌ | - |
| Git | ✅ | ❌ | - |
| Deploy | ✅ | ✅ | API |
| Test | ✅ | ❌ | - |
| Review | ✅ | ❌ | - |

---

## Current Status: Phase 1 Not Started
**Priority:** P1 (start after Agentic Phase 2)
