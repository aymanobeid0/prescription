"use client";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Clock3, MessageSquareText, ArrowUpLeft, ArrowUpRight, UserRound } from "lucide-react";
import { useMockup } from "./context";
import { clinicMinutes, clock, dentists, displayDate, minutes, moveDay } from "./data";
import { Action, Avatar, Empty, Filter } from "./primitives";

const HOUR_HEIGHT = 88;
export function Schedule() {
  const { t, locale, date, setDate, today, appointments, patients, requests, settings, dentist, setDentist, now, openModal, navigate } = useMockup();
  if (!date) return <div className="mk-panel mk-loading" aria-busy="true"><CalendarDays /></div>;
  const visibleDentists = dentists.filter(d => dentist === "all" || d.id === dentist);
  const dayAppointments = appointments.filter(a => a.date === date && a.status !== "cancelled" && (dentist === "all" || a.dentistId === dentist));
  const todayAppointments = appointments.filter(a => a.date === today && a.status !== "cancelled");
  const start = Math.floor(Math.min(minutes(settings.open), ...dayAppointments.map(a => a.start)) / 60) * 60;
  const end = Math.ceil(Math.max(minutes(settings.close), ...dayAppointments.map(a => a.start + a.duration)) / 60) * 60;
  const hours = Array.from({ length: (end - start) / 60 }, (_, i) => start + i * 60);
  const currentMinute = now ? clinicMinutes(now, settings.timezone) : -1;
  const Arrow = locale === "ar" ? ArrowUpLeft : ArrowUpRight;
  return <>
    <div className="mk-toolbar mk-panel"><div className="mk-date-controls"><label className="mk-date-input"><CalendarDays /><input type="date" aria-label={t("date")} value={date} onChange={e => { if (e.target.value) setDate(e.target.value); }} /></label><div className="mk-day-navigation"><button className="mk-icon-button" aria-label={t("previous")} onClick={() => setDate(moveDay(date, -1))}>{locale === "ar" ? <ChevronRight /> : <ChevronLeft />}</button><Action onClick={() => setDate(today)}>{t("today")}</Action><button className="mk-icon-button" aria-label={t("next")} onClick={() => setDate(moveDay(date, 1))}>{locale === "ar" ? <ChevronLeft /> : <ChevronRight />}</button></div></div>
      <div className="mk-toolbar-actions"><div className="mk-select-icon"><UserRound /><Filter label={t("dentist")} value={dentist} onChange={setDentist} options={[{ value: "all", label: t("allDentists") }, ...dentists.map(d => ({ value: d.id, label: d.name[locale] }))]} /></div><Action variant="primary" onClick={() => openModal({ kind: "newAppointment" })}><Plus />{t("newAppointment")}</Action></div>
    </div>
    <div className="mk-summary"><div><span className="mk-summary-icon"><CalendarDays /></span><div><span>{t("todayAppointments")}</span><strong>{todayAppointments.length}<small>{todayAppointments.filter(a => a.status === "completed").length} {t("completed")} · {todayAppointments.filter(a => a.status === "arrived").length} {t("arrived")}</small></strong></div></div><div><span className="mk-summary-icon"><MessageSquareText /></span><div><span>{t("pendingRequests")}</span><strong>{requests.filter(r => r.status === "pending").length}</strong></div><button className="mk-text-button" onClick={() => navigate("/mockup/requests")}>{t("reviewRequests")}<Arrow /></button></div></div>
    <section className="mk-panel mk-schedule"><div className="mk-schedule-title"><div><h2>{displayDate(date, locale, true)}</h2><span className="mk-meta"><Clock3 />{settings.timezone}</span></div><div className="mk-schedule-legend"><span className="mk-dot mk-blue-dot" />{t("confirmed")}<span className="mk-dot mk-green-dot" />{t("completed")}<span className="mk-dot mk-amber-dot" />{t("arrived")}</div></div>
      <div className="mk-calendar-head" style={{ gridTemplateColumns: `68px repeat(${visibleDentists.length}, minmax(0, 1fr))` }}><span>{t("time")}</span>{visibleDentists.map((d, i) => <div key={d.id}><Avatar name={d.name[locale].replace(/^د\. |^Dr /, "")} /><div><strong>{d.name[locale]}</strong><small>{d.specialty[locale]}</small></div><span className={`mk-dot ${i ? "mk-green-dot" : "mk-blue-dot"}`} /></div>)}</div>
      <div className="mk-calendar-scroll"><div className="mk-calendar-grid" style={{ height: hours.length * HOUR_HEIGHT, gridTemplateColumns: `68px repeat(${visibleDentists.length}, minmax(0, 1fr))` }}>
        <div className="mk-time-axis">{hours.map(h => <span key={h} style={{ top: (h - start) / 60 * HOUR_HEIGHT }}><bdi>{clock(h)}</bdi></span>)}</div>
        {visibleDentists.map(d => <div className="mk-doctor-column" key={d.id}>{hours.map(h => <div key={h} className="mk-hour-line" style={{ top: (h - start) / 60 * HOUR_HEIGHT, height: HOUR_HEIGHT }} />)}{dayAppointments.filter(a => a.dentistId === d.id).map(a => {
          const p = patients.find(p => p.id === a.patientId)!; const short = a.duration <= 15;
          return <button key={a.id} className={`mk-appointment mk-appointment-${a.status} ${short ? "mk-appointment-short" : ""}`} style={{ top: (a.start - start) / 60 * HOUR_HEIGHT, height: a.duration / 60 * HOUR_HEIGHT }} onClick={() => openModal({ kind: "appointment", id: a.id })} aria-label={`${p.name[locale]}, ${clock(a.start)}, ${a.duration} ${t("minute")}, ${t(a.status)}`}>
            {!short && <><div className="mk-appointment-top"><strong>{p.name[locale]}</strong><span>{t(a.status)}</span></div><div className="mk-appointment-bottom"><span><Clock3 /><bdi>{clock(a.start)} – {clock(a.start + a.duration)}</bdi></span><span>{a.duration} {t("minute")}</span></div>{p.alert && a.duration >= 45 && <small className="mk-appointment-alert">{p.alert[locale]}</small>}</>}
            {short && <span className="mk-short-label">{p.name[locale]} <bdi>{clock(a.start)}</bdi> · {a.duration} {t("minute")}</span>}
          </button>;
        })}</div>)}
        {date === today && currentMinute >= start && currentMinute < end && <div className="mk-now-line" style={{ top: (currentMinute - start) / 60 * HOUR_HEIGHT }}><bdi>{clock(currentMinute)}</bdi><span /></div>}
      </div></div>
      {!dayAppointments.length && <Empty text={t("noAppointments")} />}
    </section>
  </>;
}
