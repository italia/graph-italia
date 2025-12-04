/// <reference types="vite/client" />

interface Window {
  __ENV__?: {
    VITE_SERVER_URL?: string;
  };
}
