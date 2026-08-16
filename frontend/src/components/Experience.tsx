import { useState, useEffect } from "react";
import { fetchExperiences } from "../services/experience.service.js";
import { fetchEducation } from "../services/education.service.js";
import { fetchCertificates } from "../services/certificate.service.js";
import { Reveal } from "./Reveal.js";
import type { Experience as IExp, Education as IEdu, Certificate as ICert } from "../types/portfolio.js";

const formatTimelineDate = (val?: string | Date | null): string => {
  if (!val) return "";
  const d = new Date(val);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
  return String(val);
};


export const Experience = () => {
  const [experiences, setExperiences] = useState<IExp[]>([]);
  const [education, setEducation] = useState<IEdu[]>([]);
  const [certificates, setCertificates] = useState<ICert[]>([]);

  useEffect(() => {
    fetchExperiences().then((data) => setExperiences(data || []));
    fetchEducation().then((data) => setEducation(data || []));
    fetchCertificates().then((data) => setCertificates(data || []));
  }, []);

  return (
    <section id="experience" className="py-24 relative border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="mb-16">
          <Reveal direction="up" delayMs={50}>
            <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest block mb-2 font-semibold">
              04 // Career & Qualifications
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Experience & Credentials
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal direction="up" delayMs={100}>
              <h3 className="text-lg font-mono text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span>Professional Timeline</span>
              </h3>
            </Reveal>

            {experiences.length === 0 ? (
              <Reveal direction="up" delayMs={150}>
                <div className="glass-card py-16 px-6 rounded-3xl text-center border border-dashed border-border-subtle flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-surface-100/90 border border-border-subtle flex items-center justify-center mb-3 text-cyan-600 dark:text-cyan-400 shadow-sm">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-base font-display font-semibold text-slate-800 dark:text-slate-200">
                    No Experience yet
                  </h4>
                </div>
              </Reveal>
            ) : (
              <div className="relative border-l border-border-subtle ml-3 pl-8 space-y-12">
                {experiences.map((exp, i) => (
                  <Reveal key={exp._id || i} direction="up" delayMs={i * 120 + 100}>
                    <div className="relative group">
                      <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-cyan-500 group-hover:bg-cyan-500 group-hover:scale-110 transition-all shadow-sm" />

                      <div className="glass-card p-6 rounded-2xl shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-mono text-cyan-600 dark:text-cyan-300 font-medium">
                            {formatTimelineDate(exp.startDate)} — {exp.isCurrent ? "Present" : (exp.endDate ? formatTimelineDate(exp.endDate) : "Present")}
                          </span>

                          {exp.isCurrent && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                              Active Role
                            </span>
                          )}
                        </div>

                        <h4 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-1">
                          {exp.position}
                        </h4>
                        <p className="text-xs font-mono text-muted mb-4">
                          {exp.company} {exp.location && `• ${exp.location}`}
                        </p>

                        <p className="text-muted text-sm leading-relaxed mb-4 font-light">
                          {exp.description}
                        </p>

                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border-subtle">
                            {exp.technologies.map((t) => (
                              <span
                                key={t}
                                className="text-[11px] font-mono text-muted bg-surface-100 px-2.5 py-0.5 rounded border border-border-subtle"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-12">
            <div>
              <Reveal direction="up" delayMs={100}>
                <h3 className="text-lg font-mono text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Academic Background</span>
                </h3>
              </Reveal>

              {education.length === 0 ? (
                <div className="glass-card py-10 px-6 rounded-2xl text-center border border-dashed border-border-subtle flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-surface-100/90 border border-border-subtle flex items-center justify-center mb-2.5 text-indigo-600 dark:text-indigo-400 shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-display font-semibold text-slate-800 dark:text-slate-200">
                    No Education yet
                  </h4>
                </div>
              ) : (
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <Reveal key={edu._id || i} direction="up" delayMs={i * 100 + 150}>
                      <div className="glass-card p-6 rounded-2xl shadow-sm">
                        <span className="text-xs font-mono text-indigo-600 dark:text-indigo-300 block mb-1 font-medium">
                          {formatTimelineDate(edu.startDate)} — {edu.endDate ? formatTimelineDate(edu.endDate) : "Present"}
                        </span>
                        <h4 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-0.5">
                          {edu.degree}
                        </h4>
                        <p className="text-xs font-mono text-muted mb-3">
                          {edu.institution} {edu.fieldOfStudy && `• ${edu.fieldOfStudy}`}
                        </p>
                        {edu.description && (
                          <p className="text-xs text-muted leading-relaxed font-light">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Reveal direction="up" delayMs={150}>
                <h3 className="text-lg font-mono text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Verified Certifications</span>
                </h3>
              </Reveal>

              {certificates.length === 0 ? (
                <div className="glass-card py-10 px-6 rounded-2xl text-center border border-dashed border-border-subtle flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-surface-100/90 border border-border-subtle flex items-center justify-center mb-2.5 text-amber-600 dark:text-amber-400 shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-display font-semibold text-slate-800 dark:text-slate-200">
                    No Certifications yet
                  </h4>
                </div>
              ) : (
                <div className="space-y-3">
                  {certificates.map((cert, i) => (
                    <Reveal key={cert._id || i} direction="up" delayMs={i * 80 + 200}>
                      <div className="glass-card p-4 rounded-xl flex items-center justify-between group hover:border-amber-500/40 shadow-sm">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                            {cert.title}
                          </h4>
                          <p className="text-[11px] font-mono text-muted mt-0.5">
                            {cert.issuer} • {formatTimelineDate(cert.issueDate)}
                          </p>
                        </div>


                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-mono text-cyan-600 dark:text-cyan-300 hover:text-cyan-700 dark:hover:text-white p-2 rounded-lg bg-surface-100 border border-border-subtle transition-colors"
                          >
                            Verify ↗
                          </a>
                        )}
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
