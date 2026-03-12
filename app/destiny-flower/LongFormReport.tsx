"use client";

import styles from "./destiny-flower.module.css";
import { LongFormReport as LongFormReportType } from "./types";

interface LongFormReportProps {
  report: LongFormReportType;
}

export function LongFormReport({ report }: LongFormReportProps) {
  return (
    <section className={styles.longReportSection}>
      <header className={styles.longReportHeader}>
        <h4>📜 정밀 롱폼 리포트</h4>
        <span>{report.totalLength.toLocaleString()}자</span>
      </header>

      <p className={styles.longReportOpening}>{report.opening}</p>

      <div className={styles.longReportGrid}>
        {report.sections.map((section) => (
          <article key={section.title} className={styles.longReportCard}>
            <h5>{section.title}</h5>
            <p>{section.body}</p>
          </article>
        ))}
      </div>

      <p className={styles.longReportClosing}>{report.closing}</p>
    </section>
  );
}
