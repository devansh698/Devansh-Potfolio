'use client';

import { useEffect, useState } from 'react';

export function useLocalTime(timeZone: string): string {
  const [time, setTime] = useState('--:--');

  useEffect(() => {
    const format = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return time;
}
