import { useState, useEffect } from "react";
import { fetchExperiences, fetchEducation, fetchCertificates } from "../services/api.js";
import { Reveal } from "./Reveal.js";
import type { Experience as IExp, Education as IEdu, Certificate as ICert } from "../types/portfolio.js";

export const Experience = () => {
  const [experiences, setExperiences] = useState<IExp[]>([]);
  const [education, setEducation] = useState<IEdu[]>([]);
  const [certificates, setCertificates] = useState<ICert[]>([]);

  useEffect(() => {
    fetchExperiences().then((data) => setExperiences(data));
    fetchEducation().then((data) => setEducation(data));
    fetchCertificates().then((data) => setCertificates(data));
  }, []);

  return (
    <section id="experience" className="py-24 relative border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <Reveal direction="up" delayMs={50}>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
              04 // Career & Qualifications
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Experience & Credentials
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Work Experience Timeline */}
          <div className="lg:col-span-7">
            <Reveal direction="up" delayMs={100}>
              <h3 className="text-lg font-mono text-white mb-8 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Professional Timeline</span>
              </h3>
            </Reveal>

            <div className="relative border-l border-white/[0.08] ml-3 pl-8 space-y-12">
              {experiences.map((exp, i) => (
                <Reveal key={exp._id || i} direction="up" delayMs={i * 120 + 100}>
                  <div className="relative group">
                    {/* Timeline Node */}
                    <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-[#050507] border-2 border-cyan-400 group-hover:bg-cyan-400 group-hover:scale-110 transition-all shadow-[0_0_10px_rgba(56,189,248,0.4)]" />

                    <div className="glass-card p-6 rounded-2xl">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono text-cyan-300">
                          {String(exp.startDate)} — {exp.isCurrent ? "Present" : String(exp.endDate)}
                        </span>
                        {exp.isCurrent && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                            Active Role
                          </span>
                        )}
                      </div>

                      <h4 className="text-xl font-display font-bold text-white mb-1">
                        {exp.position}
                      </h4>
                      <p className="text-xs font-mono text-muted mb-4">
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </p>

                      <p className="text-muted text-sm leading-relaxed mb-4 font-light">
                        {exp.description}
                      </p>

                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.04]">
                          {exp.technologies.map((t) => (
                            <span
                              key={t}
                              className="text-[11px] font-mono text-muted-foreground bg-white/[0.02] px-2.5 py-0.5 rounded border border-white/[0.04]"
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
          </div>

          {/* Right Column: Education & Certificates */}
          <div className="lg:col-span-5 space-y-12">
            {/* Education */}
            <div>
              <Reveal direction="up" delayMs={100}>
                <h3 className="text-lg font-mono text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>Academic Background</span>
                </h3>
              </Reveal>

              <div className="space-y-4">
                {education.map((edu, i) => (
                  <Reveal key={edu._id || i} direction="up" delayMs={i * 100 + 150}>
                    <div className="glass-card p-6 rounded-2xl">
                      <span className="text-xs font-mono text-indigo-300 block mb-1">
                        {String(edu.startDate)} — {String(edu.endDate)}
                      </span>
                      <h4 className="text-lg font-display font-bold text-white mb-0.5">
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
            </div>

            {/* Certificates */}
            <div>
              <Reveal direction="up" delayMs={150}>
                <h3 className="text-lg font-mono text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Verified Certifications</span>
                </h3>
              </Reveal>

              <div className="space-y-3">
                {certificates.map((cert, i) => (
                  <Reveal key={cert._id || i} direction="up" delayMs={i * 80 + 200}>
                    <div className="glass-card p-4 rounded-xl flex items-center justify-between group hover:border-amber-400/40">
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-amber-200 transition-colors">
                          {cert.title}
                        </h4>
                        <p className="text-[11px] font-mono text-muted mt-0.5">
                          {cert.issuer} • {String(cert.issueDate)}
                        </p>
                      </div>

                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono text-cyan-300 hover:text-white p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] transition-colors"
                        >
                          Verify ↗
                        </a>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
