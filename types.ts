
export type SandboxStatus = 'DISCONNECTED' | 'INITIALIZING' | 'CONNECTED' | 'PAUSED' | 'ERROR';

export interface SandboxPayload {
  task_id: string;
  cpu: number;
  memory: number;
  network_group: string;
  isolated: boolean;
  github_url: string;
  server_url?: string;
}

export enum Step {
  GITHUB_SETUP,
  SERVER_CONFIG,
  ORCHESTRATOR
}
