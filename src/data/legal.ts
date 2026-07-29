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
  /**
   * Same clause text, but rendered as raw HTML so cross-references to the other
   * published documents can be links. Takes precedence over `text` when set;
   * keep `text` in step with it as the plain-text record of the wording.
   */
  textHtml?: string;
  /** Lettered sub-list: (a), (b), (c)… */
  items?: string[];
  /**
   * Explicit letters for `items`, one per entry, when the printed list does not
   * run (a), (b), (c)… in order. Used where a source document skips a letter:
   * the skipped item is omitted rather than published as an empty bracket, and
   * the letters that follow keep the numbering the document actually prints.
   * See the Safeguarding Policy §16.8, where the source's item (g) has no text.
   */
  itemLabels?: string[];
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
  /** Two-column data-retention table: [data type, retention period]. */
  table?: [string, string][];
  /** Generic table with its own column headings. */
  grid?: { headers: string[]; rows: string[][] };
  /** Aside set off with a rule. */
  note?: string;
  /** Same aside, rendered as raw HTML so it can carry a link. */
  noteHtml?: string;
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
  /** Further closing paragraphs. */
  outros?: string[];
}
