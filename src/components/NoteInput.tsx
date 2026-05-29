'use client';

import React, { useState, useCallback } from 'react';

interface NoteInputProps {
  questionId: string;
  initialValue?: string;
  onSave?: (questionId: string, note: string) => Promise<void>;
}

export default function NoteInput({ questionId, initialValue = '', onSave }: NoteInputProps) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleBlur = useCallback(async () => {
    if (!onSave) return;
    setSaving(true);
    setSaved(false);
    try {
      await onSave(questionId, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (_e) {
      // silent — user can retry on next blur
    } finally {
      setSaving(false);
    }
  }, [onSave, questionId, value]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="label" style={{ color: 'var(--text-muted)' }}>Notes</span>
        {saving && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Saving…</span>}
        {saved && <span className="text-xs" style={{ color: 'var(--success)' }}>Saved ✓</span>}
      </div>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="Add a note to this question…"
        rows={3}
        className="w-full resize-none text-sm leading-relaxed outline-none transition-colors"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          padding: '10px 12px',
          fontFamily: 'inherit',
        }}
        onFocus={e => {
          (e.target as HTMLTextAreaElement).style.borderColor = 'var(--accent-teal-border)';
        }}
        onBlurCapture={e => {
          (e.target as HTMLTextAreaElement).style.borderColor = 'var(--card-border)';
        }}
      />
    </div>
  );
}
