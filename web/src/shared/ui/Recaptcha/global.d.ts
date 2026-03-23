interface Window {
  grecaptcha: {
    render: (
      container: HTMLElement,
      params: {
        sitekey: string;
        callback: (token: string) => void;
      },
    ) => number;
    reset?: (widgetId?: number) => void;
    execute?: () => void;
  };
}
