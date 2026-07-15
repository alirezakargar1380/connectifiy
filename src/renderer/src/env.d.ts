/// <reference types="vite/client" />

import { NetworkUsage } from "src/utils/monitoring";

export {};

declare global {
  interface Window {
    api: {
      getProxy(): Promise<boolean>;
      getProxyServer(): Promise<string>;
      getVpn(): Promise;
      getDns(): Promise;
      getUsage(): Promise;
      isConnected(): Promise;
      checkInternet(): Promise;
      sendDeleteDns(interfaceName: string): Promise;
      onInternetStatus: (callback: (data: any) => void) => void;
      startMonitoring: (interval: number) => Promise<{ success: boolean }>;
      stopMonitoring: () => Promise<{ success: boolean }>;
      getConnectionInfo: () => Promise<ConnectionInfo>;
    };
  }
}