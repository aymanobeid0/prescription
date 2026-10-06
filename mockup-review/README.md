# Mockup review evidence

Preview: http://127.0.0.1:3001/mockup

Source brief: D:/clinic-app/design.md. No generated concept image, by user choice.
Reference: `reference-desktop.png`, captured from localhost:3000 at 1440x900.
Implementation: `schedule-ar-1440.png` and the page/dialog screenshots for both
languages at 1440x900, 1280x800 and 390x844. Screenshots were captured in installed
Chrome with Playwright, after verifying navigation completion. Reference and
implementation images were inspected with `view_image` in the same QA pass.
IAB independently verified the reference, schedule, overlap error and request/
patient surfaces. The standalone Browser plugin is not installed.

## Fidelity ledger

| Review point | Reference / brief | Implemented evidence and resolution |
| --- | --- | --- |
| Palette and surfaces | Exact blue #192f86, white surface, #edf1f6 canvas, #f4f3f3 fields | Shared scoped tokens; `schedule-ar-1440.png`, `settings-fr-1280.png`. No cream surfaces or decorative gradients. |
| Desktop shell | Labeled 224px sidebar, 64px header; gray fields and substantial icons | `schedule-ar-1440.png` and French counterpart; RTL sidebar right, LTR sidebar left. |
| Type and controls | Arabic-capable font, distinct hierarchy, 48px equal-width form controls, 23px icons | `appointment-dialog-ar-1440.png`, `request-dialog-fr-1280.png`; Cairo Arabic and Latin sans; two-column desktop forms. |
| Schedule anatomy | Full-width dentist columns, shared hourly axis, real duration | Schedule screenshots and QA checks; 88px/hour and 5-minute event 7.33px high, selectable annotation and full dialog. |
| Dialog actions | Floating detail; solid blue primary/red destructive; neutral dismiss | Appointment/request dialog screenshots; removed duplicate request patient selector and combined action footer. Native time update and label associations repaired during browser QA. |
| Responsive behavior | Reflow without clipped controls or page-wide overflow | 390px screenshots; patient/invoice rows reflow in place. Fixed invoice preview button that initially required inner horizontal scrolling. Long dialogs scroll with pinned heading/action footer. |
| Navigation and counts | Five pages; request count independent from unread notices | Requests/notifications workflow checks in `qa-results.json`; reading and resolving update different counts. |
| Print | Browser print, document-only output | `invoice-preview-fr.png`, `invoice-print.pdf`: one A5 page, no application chrome. |

Above-the-fold copy review: five required navigation labels and their French
translations, patient/phone search, one New Appointment action, today/request
summary, and schedule date/dentist headings are present. The short page context
and fictional-data disclosure belong to the agreed mockup. No revenue, chair
utilization, imaging, AI or additional product navigation was introduced.

Intentional differences from the inspiration follow design.md: dentist columns
replace operatories; compact two-part summary replaces four metric cards; details
are dialogs; Arabic is default; the calendar occupies the full content width.
Fictional data and delivery simulation reset on reload. Clinical/advanced finance
and product API integration remain outside scope. No material known mismatch
against the agreed mockup brief remains; user visual approval is still pending.

Core acceptance checks are recorded in `qa-results.json`. No browser runtime or
console errors were observed in the mockup, and it made no backend/Supabase
requests. The inspiration page's unrelated missing favicon was excluded from
mockup console reporting. Screenshots hide the development-tools launcher only;
the app itself has no screenshot-specific layout or behavior.

## Picker review fixes — 2026-10-06

Appointment/request date and time fields and Settings opening/closing fields
reuse one large accessible picker button. Native indicators are hidden; the button
has hover feedback and a pointer cursor. Focused Chrome checks passed native
opening, Enter activation, editing, settings save, Arabic/French labels and narrow
reflow. TypeScript and affected-file ESLint passed. Evidence: `picker-fix-ar.png`
and `settings-picker-fix-ar.png`. Visual approval remains pending.

Pre-push integration: rebased onto upstream main without conflicts. Mockup lint
passed with the existing proxy warning. Whole-web TypeScript fails in unchanged
upstream `dashboard/calendar/CalendarClient.tsx:127` (TS7006, implicit-any `apt`).
The earlier passing TypeScript result predates those upstream dashboard changes.
