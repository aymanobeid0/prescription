# Clinic design mockup

Open http://127.0.0.1:3001/mockup after running this app with:

```powershell
npm run dev -- --hostname 127.0.0.1 --port 3001
```

The optional catch-all route provides schedule, patients and patient profiles,
booking requests, billing/documents and settings. The route layout keeps local
state alive during navigation; refresh resets the fictional data and Arabic
locale. Only the mockup route bypasses Supabase initialization in proxy.ts.

`design.md` in D:/clinic-app is the layout/color source of truth. The running
DentalCare reference at localhost:3000 informed control shape, spacing and icon
weight. No generated concept image was used, as requested by the user.

## Behavior

- Arabic RTL and French LTR labels, page navigation and dialogs; international
  phone numbers, IDs, times and currency are isolated from surrounding text.
- Clinic-local current day/time, dentist columns and filter, exact-minute
  appointment positioning and duration-proportional heights, including 5 minutes.
- Creation/edit/cancel with required-field, hours and doctor/patient overlap
  validation. Dialogs use installed Base UI focus trapping/Escape/restoration.
- Patient search/profile/add with international-phone validation and duplicate
  lookup; free-text names/notes are preserved as entered in either language.
- Request review with provisional/final times, separate patient/sender phones,
  confirm/reject and explicitly simulated recipient delivery. Unread notification
  count and pending request count are independent.
- Invoice preview and browser print, and session-only clinic/account settings.

All actions simulate the receptionist's design workflow. Appointment statuses and
delivery are local presentation state; they do not change or extend production
contracts. No auth, payment entry, live messages, clinical charting or APIs.

## Verification — 2026-10-06

TypeScript and affected-file ESLint passed; proxy.ts retains its pre-existing
unused `options` warning. The installed Playwright/Chrome runner verified the
main local workflows, overlap boundaries, focus trap/Escape/restoration, counts,
reset and browser print. IAB was used for initial/reference and implementation
inspection; installed Playwright saved repeatable evidence because the separate
Browser plugin/skill is not installed.

All five pages and representative creation/review dialogs were reviewed in Arabic
and French at 1440x900, 1280x800 and 390x844. No page-wide or table-wrapper overflow,
browser errors, Supabase or backend API requests. Invoice output is one A5 page.
The temporary QA runner was removed after verification.

Screenshots, QA results and the design fidelity ledger are in
`C:/Users/ayman/Desktop/dental-UI-design/mockup-review/`.
User visual approval remains pending; product implementation has not started.
