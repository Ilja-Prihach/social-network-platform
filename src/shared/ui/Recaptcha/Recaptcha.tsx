'use client';

import { useEffect, useRef } from 'react';

type RecaptchaProps = {
  siteKey: string;
  onChange: (token: string) => void;
};

export function Recaptcha({ siteKey, onChange }: RecaptchaProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.grecaptcha && ref.current) {
        window.grecaptcha.render(ref.current, {
          sitekey: siteKey,
          callback: onChange,
        });

        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [siteKey, onChange]);

  return <div ref={ref} />;
}
