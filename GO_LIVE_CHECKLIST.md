# AI Studio Vision - Go-Live Production Checklist
### Final Verification, System Audits, and Operational Recovery Playbooks

---

## 1. Environment Configurations & Secrets

- [ ] **GEMINI_API_KEY**:
  - Securely configured inside Cloud Run, Vercel, or the hosting control panel.
  - Never committed to git or printed in runtime error logs.
- [ ] **APP_URL**:
  - Properly set to the final secure production domain (e.g., `https://vision.aistudio.dev`).
  - Required for callback routing and self-referential download proxies.
- [ ] **NODE_ENV**:
  - Explicitly declared as `production` on live containers to disable dev-server asset watches.

---

## 2. Infrastructure & Scale Readiness

- [ ] **Ingress Constraints (Port 3000)**:
  - Confirm the Express listener in `server.ts` is bound to host `0.0.0.0` on port `3000`.
  - Validate that Nginx or your container proxy passes the standard maximum payload headers (up to `50MB`) to accommodate high-resolution base64 images.
- [ ] **In-Memory Queue Limits**:
  - Since `jobsDB` leverages an in-memory `Map` for ultra-fast polling, verify that clean-up timers or cron scripts are configured to prune completed tasks older than 24 hours.
  - Recommended maximum queue depth is 1,000 parallel jobs per container node.

---

## 3. Security Compliance & OWASP Hardening

- [ ] **Strict HTTPS & HSTS**:
  - Ensure the hosting router forces TLS v1.3 with a valid, auto-renewing Let's Encrypt certificate.
- [ ] **Content Security Policy (CSP)**:
  - Verify that the frontend index.html accepts connections from `api.dicebear.com` (avatars) and the primary Google Gemini API endpoints without warning blocks.
- [ ] **CORS Headers**:
  - Confirm that only specified developer domains are allowed to hit `/api/jobs/create` via third-party custom API keys.

---

## 4. Runbook: Manual Token & Credit Adjustments

If a customer purchases additional processing tokens, or a Sandbox profile needs credit modification, administrators can perform manual adjustments:

### Step-by-Step Playbook:
1. Navigate to the **Settings Center** tab from the main header.
2. Select **Admin Telemetry** from the sub-navigation menu. *(Note: This sub-tab is only visible and accessible to accounts authorized with the `ADMIN` role)*.
3. Locate the **User Sandbox Credit Manager** panel.
4. Locate the target user's email address (e.g., `pro@vision.ai`).
5. Click **Add +100** or **Deduct -50** to modify credits live.
6. Check the in-app state or the user's dashboard to confirm the credit reflects instantly in their browser frame session.

---

## 5. Disaster Recovery & Node Outages

In the event of a container crash, network partition, or API timeout:

- **State Persistence Failover**: 
  - User activity, completed downloads, and active session logins are completely mirrored inside the client’s `localStorage`.
  - If a server node restarts, users will *not* lose their historical downloads, favorite items, or current plan configurations. They can simply refresh the browser tab to reconnect to the queue.
- **Queue Backup Restores**:
  - Administrators should monitor the backend `/api/health` route. If `active_jobs` is non-zero but `queue_length` is stuck, trigger a safe container redeploy. The server's lazy model initialization guarantees that the queue will resume safely on startup.

---
*Created by the DevOps & Reliability Engineering Team* &mdash; **AI Studio Vision Inc.**
