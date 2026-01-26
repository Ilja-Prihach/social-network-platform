'use client';

import { useEffect, useRef } from 'react';

type RecaptchaProps = {
  siteKey: string;
  onChange: (token: string) => void;
};

export function Recaptcha({ siteKey, onChange }: RecaptchaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.grecaptcha && ref.current && widgetIdRef.current === null) {
        widgetIdRef.current = window.grecaptcha.render(ref.current, {
          sitekey: siteKey,
          callback: (token: string) => onChangeRef.current(token),
        });

        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [siteKey]);

  return <div ref={ref} />;
}
