'use client';

import { useEffect, useState } from 'react';

/** Types, holds, deletes and cycles through words. */
export function useTypewriter(words: readonly string[], isActive = true): string {
  const [state, setState] = useState({ word: 0, chars: 0, isDeleting: false });

  useEffect(() => {
    if (!isActive) return;
    const word = words[state.word % words.length];
    const isFull = !state.isDeleting && state.chars === word.length;
    const isEmpty = state.isDeleting && state.chars === 0;
    const delay = isFull ? 1600 : state.isDeleting ? 28 : 64;

    const t = setTimeout(() => {
      setState((s) => {
        if (isFull) return { ...s, isDeleting: true };
        if (isEmpty) return { word: s.word + 1, chars: 0, isDeleting: false };
        return { ...s, chars: s.chars + (s.isDeleting ? -1 : 1) };
      });
    }, delay);
    return () => clearTimeout(t);
  }, [state, words, isActive]);

  return words[state.word % words.length].slice(0, state.chars);
}
