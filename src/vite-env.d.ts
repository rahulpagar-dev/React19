/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MSG91_WIDGET_ID: string;
  readonly VITE_MSG91_TOKEN_AUTH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
