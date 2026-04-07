

## PR Approval Timeline Detail Page

### What We're Building
A new detail page at `/purchase-requisitions/:id` that shows the full approval journey of a PR as a vertical timeline, with status indicators, approver info, signatures, timestamps, and a clear "next action" indicator.

### Changes

**1. Create `src/pages/PRDetail.tsx`**
- Header with back button, PR number, title, status badge, and priority badge
- Left section: PR summary card (amount, department, category, requester, date)
- Right/main section: **Approval Timeline** — a vertical timeline showing each approval step:
  - Each node shows: approver name, designation, action (Approved/Rejected/Pending), timestamp, signature status
  - Visual indicators: green check (approved), red X (rejected), amber clock (pending), grey dot (future)
  - Connector lines between nodes with color coding
  - The "current" step is highlighted with a pulsing indicator and labeled "Awaiting action"
- Bottom: approval history table with all actions, comments, and timestamps
- Mock data for PR-2025-001 with ~4 approval steps (2 approved, 1 pending, 1 future)

**2. Update `src/App.tsx`**
- Add route: `/purchase-requisitions/:id` → `PRDetail`

**3. Update `src/pages/PurchaseRequisitions.tsx`**
- Make PR number and title cells clickable links using `react-router-dom`'s `useNavigate`
- Navigate to `/purchase-requisitions/${pr.id}` on click

### Timeline Node Design (each step)
```text
  ●──── Approved ─────────────────────────
  │  Sarah Johnson (Department Head)
  │  Jan 28, 2025 at 10:30 AM
  │  ✍ Signature: Verified
  │  Comment: "Approved. Budget allocated."
  │
  ◉──── Pending (Current) ───────────────
  │  Michael Chen (General Manager)
  │  Awaiting action since Jan 28, 2025
  │  Next responsible approver
  │
  ○──── Upcoming ─────────────────────────
     Emily Brown (CFO)
     Not yet reached
```

