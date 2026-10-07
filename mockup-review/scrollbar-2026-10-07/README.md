# Sidebar scrollbar audit — 2026-10-07

Scope: the user-reported scrollbar appearing/disappearing during mockup sidebar
navigation. Captured and inspected fresh screenshots through Codex Browser.

1. Requests before: issue confirmed. At 1280x800 the document used 1280px and
   had no vertical scrollbar. Evidence: 01-requests-before.png.
2. Settings before: issue confirmed. The taller page used 1265px because of the
   scrollbar, moving the shell by 15px. Evidence: 02-settings-before.png.
3. Requests after: passed. Screen-only, mockup-scoped root overflow-y: scroll
   and scrollbar-gutter: stable keep a consistent scrollbar track. Document
   width is 1265px on short and long pages. Evidence: 03-requests-after.png.
4. Settings and all five sidebar pages after: passed in Arabic and French at
   1280x800; document and main widths stay constant, with no horizontal overflow.
   Evidence: 04-settings-after.png, 05-requests-fr-after.png, measurements.json.
5. Notification dialog: passed. Background main width stays constant while
   Base UI locks scrolling. Escape closes it and restores focus to the bell.
6. Mobile Requests: passed at 390x844, with no horizontal overflow and readable
   labels. Evidence: 06-requests-mobile-after.png.
7. Handoff: Arabic Requests restored, viewport override reset, no captured browser
   error logs. Evidence: 07-final-requests.png.

The screenshot files above were saved and opened for inspection before acceptance.
This focused audit does not cover every workflow, full accessibility compliance,
real devices, other browsers, or print output. The CSS rule applies only on screen
while .mk-app is present; existing print rules and other product routes are unchanged.
User visual approval of the full mockup remains pending.

## Notification color follow-up

8. Before: unread rows were pale blue and read rows white; captured in
   08-notifications-before.png.
9. After: unread rows use warning fill #fffaeb, read rows success fill #ecfdf3.
   Exact computed RGB values verified; labels and unread dots remain. Hover keeps
   the state fill and adds an inset outline. Evidence: 09-notifications-colors-after.png.
10. Reading the first notification: passed. Reopening the bell shows its row
    green, the remaining unread row yellow, and the bell count falls from 2 to 1.
    Evidence: 10-notifications-read-transition.png. Screenshots saved and inspected.

CSS-only change; no code tests needed. Full accessibility compliance not assessed.

## Dropdown follow-up

Scope: all dropdown choice menus in the mockup. Native select implementations
were replaced with the installed Base UI Select; no new dependency was added.

11. Before: source and DOM confirmed native menus. Screenshot
    11-dropdown-native-before.png shows the trigger, but OS popup content was
    not captured by the browser screenshot API; do not treat it as popup evidence.
12. Schedule dentist filter: passed selection; shared app popup in
    12-dropdown-dentist-after.png.
13. Appointment patient/dentist: passed selection within the modal; scrollable
    patient menu, phone isolation and medical-alert update verified. Evidence:
    13-dropdown-patient-after.png. Submitting without a patient blocks creation
    and focuses the patient trigger; no appointment was created by testing.
14. Request status filter: passed ArrowDown/Enter selection and Escape focus
    restoration. Filter width corrected to remain compact. Intermediate evidence:
    14-dropdown-requests-after.png; final width in 21-dropdown-final-after.png.
15. Billing filter: passed unpaid selection. 15-dropdown-billing-after.png.
16. Settings timezone: passed selection and restoration to Africa/Casablanca.
    16-dropdown-timezone-after.png. Field label wrappers caused click interference;
    replaced with containers retaining explicit accessible labels. Dropdowns do
    not lock page scrolling; popup positioning stays within viewport bounds.
17. Settings language: passed French selection and Settings save.
    17-dropdown-language-after.png.
18. Account language: passed within dialog in French, then restored Arabic.
    18-dropdown-account-fr-after.png.
19. Request review dentist: passed draft selection/cancel without booking.
    19-dropdown-review-dentist-after.png.
20. Mobile status menu: passed at 390x844, client/scroll width both 375px, no
    horizontal overflow. 20-dropdown-mobile-after.png.
21. Final: Arabic Requests restored, schedule filter reset to all dentists and
    viewport override reset. 21-dropdown-final-after.png.

All accepted screenshots were saved and opened for inspection. Whole-web
TypeScript and affected-file ESLint passed after final component edits. No
captured browser errors. Native select source occurrences are gone from mockup
components. Full accessibility compliance, real devices and other browsers were
not assessed. Date/time picker behavior remains the previously requested flow.

## Later annotated review — 2026-10-07

22. Notification bells match warning/success fills and stroke tokens.
23–25. Stationary hover feedback and input outlines; inspected motion resets.
26–27. Whole-field working-hour pickers and primary review buttons.
28. Neutral gray main canvas, exact token verified.
29. Patient identity click opens matching file; Enter verified on another patient.
30–31. Green confirmed, yellow arrived, red canceled; cancellation stays visible
    and active count changes 8 to 7. Completed stays green.
32. One clickable schedule picker icon; input date change and focus verified.
33. Gray date fill, dark card text and solid white-label status badges.
    Calculated contrast: card text 15.75–16.41:1; badges 6.57–7.04:1.
34. Removed day arrows; date selection and Today reset verified.
35. Profile labels/values share RTL right edges while values remain LTR.
36–37. Profile labels/values and list phone/file values verified at weight 700.

Screenshots saved and inspected. TypeScript/affected ESLint passed after the
last component edit. Later CSS-only updates passed browser and whitespace checks.
User finished today's review; full mockup approval remains pending. Native picker
popup contents, real devices and full accessibility compliance remain unverified.
