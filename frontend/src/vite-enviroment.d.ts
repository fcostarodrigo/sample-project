/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_NOTIFICATION_PUBLIC_KEY: string;
}
