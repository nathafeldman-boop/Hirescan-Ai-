// Types partagés entre la page Journal, la fiche de détail et la timeline.

export interface JournalEntryLite {
  day: string; // "YYYY-MM-DD"
  mood: number;
  energy: number;
  stress: number;
  emotion: string | null;
  tags: string[] | null;
  note: string | null;
}

export interface JournalEntryFull extends JournalEntryLite {
  photo: string | null;
}
