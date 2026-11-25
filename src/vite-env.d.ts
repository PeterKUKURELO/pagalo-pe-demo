/// <reference types="vite/client" />

interface FlexPaymentInstance {
  init: (
    container: HTMLElement,
    onResult: (response: unknown) => void,
    onTracking: (tracking: unknown) => void,
    onError: (error: unknown) => void,
  ) => void;
  terminate?: () => void;
}

interface Window {
  FlexPaymentForms?: new (configuration: Record<string, unknown>) => FlexPaymentInstance;
}
