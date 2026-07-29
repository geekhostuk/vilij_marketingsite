// The Vilij — shared shape for the legal documents published on the site:
// the Privacy Policy, User Terms of Use, Community Guidelines and the
// Complaints and Reporting Procedure.
//
// All four are transcribed verbatim from the source PDFs held by The Vilij.
// Clause numbering is reproduced exactly as it appears in those documents,
// including where the source itself is inconsistent — the documents reference
// each other by clause number, so renumbering them here would break those
// cross-references and change what the published policy says.

export interface LegalClause {
  /** Clause number as printed in the source document, e.g. "1.1". */
  n: string;
  /** Bold run-in heading before the clause text. */
  lead?: string;
  text: string;
  /** Lettered sub-list: (a), (b), (c)… */
  items?: string[];
  /** Unnumbered bullet list. */
  bullets?: string[];
  /** Defined terms: [term, definition]. */
  defs?: [string, string][];
  /** Numbered steps, each with its own bullets. */
  steps?: { title: string; intro?: string; bullets: string[] }[];
  /** Trailing paragraph after any list. */
  outro?: string;
  /** Renders The Vilij Limited's registered details. */
  contact?: boolean;
  /** Two-column table: [left, right]. */
  table?: [string, string][];
  /** Aside set off with a rule. */
  note?: string;
  /** Renders a link to the Information Commissioner's Office. */
  ico?: boolean;
}

export interface LegalSection {
  /** Section number as printed in the source document. */
  n: string;
  title: string;
  /** Lead paragraph before the clauses. */
  intro?: string;
  /** Further lead paragraphs. */
  intros?: string[];
  clauses?: LegalClause[];
  /** Section-level bullet list, for sections written without numbered clauses. */
  bullets?: string[];
  /** Closing paragraph after the clauses or bullets. */
  outro?: string;
}
