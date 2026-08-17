# F1 — Identity, Auth, RBAC & Org Model

| | |
|---|---|
| **Class** | BUILD |
| **Batch** | 1 |
| **Depends on** | none (root module) |
| **Replaces** | Per-tool logins across Notion, Odoo, Meta Business, Google Workspace |
| **Build estimate** | 3 weeks |
| **Status** | Draft |

## 1. Purpose & Scope

Provides the single identity, authentication and authorisation layer for the entire platform. Every other module delegates "who is this and what may they do" to F1 and never implements its own check.

**In scope:** user accounts, sessions, password and OAuth login, MFA, the organisation and department model, role and permission definitions, permission enforcement primitives, SSO bridging into wrapped systems, service accounts for agents.

**Not in scope:** client-facing portal accounts (M12 defines its own guest role against this model), tenant signup and billing (deliberately deferred — see `01-architecture.md` §4).

## 2. Business Context

BPS staff currently hold separate credentials for Notion, Google Workspace, Meta Business Manager, Odoo, Hostinger and Razorpay. There is no central record of who has access to what, and no way to revoke access on departure in one action — a real risk given that marketing staff hold access to client ad accounts with live budgets and to client social accounts.

The Notion workspace already encodes an organisational structure worth preserving: `BPS Project Management` → `Projects` where each department is a project, with an `Owner` per department. F1's department model maps directly onto this.

## 3. Personas & Roles

| Persona | Role | What they do here |
|---|---|---|
| Rajesh Kumar Gouda | `owner` | Full access. Manages roles, approves high-value actions. |
| Silu Behera | `manager` | Cross-department operational access. Approves most agent actions. |
| Department lead | `dept_lead` | Full access within own department, read across others |
| Staff member | `member` | Work within assigned department and assigned clients |
| Freelancer / vendor | `contractor` | Scoped to specific projects only. No client-list visibility. |
| Client contact | `client_guest` | M12 portal only. Own data only. |
| AI agent | `service` | Non-human principal. Permissions are a strict subset of its invoking user's. |

## 4. Functional Requirements

### Authentication

| ID | Requirement | Priority |
|---|---|---|
| FR-F1-01 | The system shall authenticate users by email and password, with passwords hashed using Argon2id. | Must |
| FR-F1-02 | The system shall support Google OAuth login, since all staff already hold Google Workspace accounts. | Must |
| FR-F1-03 | The system shall support TOTP-based MFA, and shall require it for `owner` and `manager` roles. | Must |
| FR-F1-04 | The system shall expire idle sessions after 12 hours and absolute sessions after 30 days. | Must |
| FR-F1-05 | The system shall allow a user to view and revoke their own active sessions. | Should |
| FR-F1-06 | The system shall lock an account for 15 minutes after 10 consecutive failed login attempts. | Must |
| FR-F1-07 | The system shall provide password reset via a single-use token expiring in 60 minutes. | Must |

### Organisation & department model

| ID | Requirement | Priority |
|---|---|---|
| FR-F1-08 | The system shall model an `organisation` as the tenancy root, with exactly one organisation existing in v1. | Must |
| FR-F1-09 | The system shall model `department` records mirroring BPS structure: Creative, Digital Marketing, DOP & Operations, HR, Website Development, Video Editing & Graphics, Finance. | Must |
| FR-F1-10 | The system shall allow a user to belong to multiple departments with a distinct role in each. | Must |
| FR-F1-11 | The system shall designate one user as department lead per department. | Must |
| FR-F1-12 | The system shall support client assignment, restricting a `member` to only the clients they are assigned to. | Must |

### Authorisation

| ID | Requirement | Priority |
|---|---|---|
| FR-F1-13 | The system shall define permissions as `<module>:<resource>:<action>` triples, e.g. `M10:broadcast:send`. | Must |
| FR-F1-14 | The system shall resolve a user's effective permissions as the union of their role grants across departments, minus explicit denials. | Must |
| FR-F1-15 | The system shall expose a single server-side authorisation primitive that every module calls; no module implements its own permission logic. | Must |
| FR-F1-16 | The system shall deny by default — an unrecognised permission resolves to denied, never granted. | Must |
| FR-F1-17 | The system shall set `app.current_org` on every database transaction before any query executes. | Must |
| FR-F1-18 | The system shall allow the `owner` to define custom roles as named permission sets. | Should |

### Service accounts for agents

| ID | Requirement | Priority |
|---|---|---|
| FR-F1-19 | The system shall issue `service` principals to AI agents, with permissions that are always a strict subset of the invoking user's. | Must |
| FR-F1-20 | The system shall prevent a `service` principal from holding any permission its invoking user lacks, even if explicitly granted. | Must |
| FR-F1-21 | The system shall record both the agent principal and the invoking human on every agent-initiated action. | Must |

### Lifecycle

| ID | Requirement | Priority |
|---|---|---|
| FR-F1-22 | The system shall support suspending a user, immediately invalidating all sessions and revoking all connector tokens held on their behalf. | Must |
| FR-F1-23 | The system shall retain a suspended user's record and audit history rather than deleting it. | Must |
| FR-F1-24 | The system shall provide an access review showing every user, their departments, roles and assigned clients on one screen. | Should |

## 5. AI & Agent Capabilities

F1 hosts no agents of its own. It provides the principal model that every other module's agents run under.

**The subset rule (FR-F1-19/20) is the platform's core containment mechanism.** An agent can never escalate beyond the human who invoked it. A compromised or misbehaving agent is bounded by that user's permissions, which bounds worst-case blast radius to what that person could have done manually.

## 6. Automations

| Name | Trigger | Steps | Editable |
|---|---|---|---|
| Offboarding revocation | User marked as leaving (H6) | Suspend account → revoke sessions → revoke connector tokens → notify owner → open access-review task | No — security critical |
| Dormant access review | Quarterly | Compile users with no login in 90 days → notify owner | Yes |

## 7. Data Model

```sql
CREATE TABLE organisations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
-- No org_id: this IS the tenancy root.

CREATE TABLE users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  email         citext NOT NULL,
  name          text NOT NULL,
  password_hash text,                    -- null when OAuth-only
  mfa_secret    text,                    -- encrypted at rest
  status        text NOT NULL DEFAULT 'active',  -- active | suspended
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, email)
);

CREATE TABLE departments (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id   uuid NOT NULL REFERENCES organisations(id),
  name     text NOT NULL,
  slug     text NOT NULL,
  lead_id  uuid REFERENCES users(id),
  UNIQUE (org_id, slug)
);

CREATE TABLE memberships (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  user_id       uuid NOT NULL REFERENCES users(id),
  department_id uuid NOT NULL REFERENCES departments(id),
  role          text NOT NULL,           -- owner|manager|dept_lead|member|contractor
  UNIQUE (org_id, user_id, department_id)
);

CREATE TABLE roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organisations(id),
  slug        text NOT NULL,
  name        text NOT NULL,
  permissions text[] NOT NULL DEFAULT '{}',
  is_system   boolean NOT NULL DEFAULT false,
  UNIQUE (org_id, slug)
);

CREATE TABLE client_assignments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id     uuid NOT NULL REFERENCES organisations(id),
  user_id    uuid NOT NULL REFERENCES users(id),
  client_id  uuid NOT NULL,              -- FK added when M1 lands
  UNIQUE (org_id, user_id, client_id)
);

CREATE TABLE service_principals (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES organisations(id),
  agent_key    text NOT NULL,            -- e.g. 'M4.content_strategist'
  created_by   uuid NOT NULL REFERENCES users(id),
  permissions  text[] NOT NULL DEFAULT '{}',
  expires_at   timestamptz,
  UNIQUE (org_id, agent_key, created_by)
);

CREATE TABLE sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES organisations(id),
  user_id      uuid NOT NULL REFERENCES users(id),
  token_hash   text NOT NULL,
  ip           inet,
  user_agent   text,
  expires_at   timestamptz NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);
```

All tables except `organisations` carry RLS with the standard isolation policy from `01-architecture.md` §4.

## 8. Connectors & Integrations

| System | Via | Auth | Notes |
|---|---|---|---|
| Google Workspace | OAuth 2.0 | Authorisation code + PKCE | Login only in F1; data scopes belong to F4 |
| Frappe HR | SSO bridge | OIDC | H1 dependency |
| ERPNext | SSO bridge | OIDC | Fin dependency |
| Chatwoot | SSO bridge | OIDC | O8 dependency |
| Activepieces | SSO bridge | OIDC | F11 dependency |

Running an OIDC provider so wrapped systems accept BPS identity is the single most valuable piece of F1 — without it, staff hold separate logins for four more systems and the consolidation goal fails.

## 9. Screens & UX Flows

| Screen | Purpose |
|---|---|
| Login | Email/password + "Continue with Google" |
| MFA challenge | TOTP entry, recovery code fallback |
| Password reset | Request and confirm |
| User directory | All users, departments, roles, last login |
| User detail | Edit memberships, roles, client assignments; suspend |
| Department settings | Manage departments and leads |
| Role editor | Custom roles as permission sets |
| Access review | One-screen matrix of who can access what |
| My sessions | View and revoke own sessions |

**Empty state:** first run shows setup guidance — create the organisation, create departments, invite users. Covered by F8.

**Error state:** authorisation failures state *what* was denied and *who to ask*, never a bare "Access denied". A staff member blocked mid-task must know their next step.

## 10. Non-Functional Requirements

| Aspect | Requirement |
|---|---|
| Performance | Permission check ≤ 5 ms p99, served from an in-request cache |
| Security | Argon2id passwords; MFA secrets and OAuth tokens encrypted at rest; session tokens stored hashed |
| Availability | Auth failure blocks the entire platform — no external dependency in the critical login path except optional Google OAuth |
| Data retention | Audit records retained 7 years; sessions purged 30 days after expiry |
| Scale | Designed for ≤ 100 users. Client portal accounts (M12) may reach ~1,000. |

## 11. Compliance

- **DPDP Act 2023** — users are data principals. Requires stated purpose, retention limits, and a deletion path. Deletion conflicts with audit retention; resolved by anonymising personal fields while preserving audit rows.
- **Access control for client assets** — staff hold access to client ad accounts and social profiles. FR-F1-22 revocation is a contractual obligation to those clients, not merely internal hygiene.

## 12. Guided Mode Requirements

- **First-run:** wizard creating organisation → departments → first users. Departments pre-populated from the existing BPS structure.
- **Explain-this:** "role", "permission", "department", "service account" all need plain-language definitions. Assume no prior systems-administration knowledge.
- **Next-best-action:** prompt to enable MFA; flag users with no department; flag departments with no lead.
- **Guardrails:** the last `owner` cannot be removed or demoted. Suspending a user warns which in-flight work is assigned to them. Custom roles cannot grant permissions the creating user lacks.

## 13. Acceptance Criteria

1. Given a `member` in Digital Marketing, when they open a DOP & Operations record, then access is denied with an explanatory message naming the department lead.
2. Given a `contractor` assigned to one project, when they open the client list, then only that project's client is visible.
3. Given an agent invoked by a `member`, when it attempts an action the member lacks permission for, then it is denied and the attempt is logged.
4. Given a user is suspended, when they retry any request with an existing session, then it is rejected and all connector tokens issued on their behalf are revoked.
5. Given any table in the schema, when inspected, then it has `org_id NOT NULL` and RLS enabled.
6. Given MFA is enabled for `owner`, when an owner logs in without a TOTP code, then access is refused.

## 14. Dependencies

None. F1 is the root module and must ship first.

Downstream: **every** module depends on F1.

## 15. Out of Scope / Future

| Excluded | Reasoning |
|---|---|
| Tenant signup & billing | v1 is BPS-only. Schema supports it; UI does not. |
| SAML | No enterprise client requires it. OIDC suffices. |
| Fine-grained per-record ACLs | Department + client assignment is sufficient. Revisit only on real need. |
| Hardware key MFA | TOTP adequate at this scale. |

## 16. Open Questions

| # | Question | Blocks | Owner |
|---|---|---|---|
| 1 | Should `contractor` accounts expire automatically at project end? | FR-F1-22 scope | Rajesh |
| 2 | Do freelance editors and drone pilots get platform accounts, or work only through O6 vendor records? | Role model | Rajesh |
| 3 | Which staff currently hold access to client Meta ad accounts? Needed to seed assignments correctly. | Migration | Rajesh |
| 4 | Is Google Workspace the permanent identity source, making Google OAuth the primary login? | FR-F1-02 priority | Rajesh |
