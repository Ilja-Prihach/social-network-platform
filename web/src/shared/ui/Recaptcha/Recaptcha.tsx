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
      const grecaptcha = (window as { grecaptcha?: unknown }).grecaptcha;
      if (!grecaptcha || widgetIdRef.current !== null || !ref.current) return;

      const renderFn =
        typeof (grecaptcha as { render?: unknown }).render === 'function'
          ? (grecaptcha as { render: (container: Element, params: unknown) => number }).render
          : typeof (grecaptcha as { enterprise?: { render?: unknown } }).enterprise?.render ===
              'function'
            ? (
                grecaptcha as {
                  enterprise: { render: (container: Element, params: unknown) => number };
                }
              ).enterprise.render
            : null;

      if (renderFn) {
        widgetIdRef.current = renderFn(ref.current, {
          sitekey: siteKey,
          callback: (token: string) => onChangeRef.current(token),
        });
        clearInterval(interval);
        return;
      }

      if (typeof (grecaptcha as { execute?: unknown }).execute === 'function') {
        (grecaptcha as { ready: (fn: () => void) => void }).ready(() => {
          (
            grecaptcha as {
              execute: (key: string, options: { action: string }) => Promise<string>;
            }
          )
            .execute(siteKey, { action: 'password_recovery' })
            .then((token) => onChangeRef.current(token));
        });
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [siteKey]);

  return <div ref={ref} />;
}
