// src/lib/axp2web.ts

export interface AxpConfig {
  EMail: string;
  host: string;
  port: number | string;
  callback: (data: any) => void;
}

export class Axp2Web {
  private ws: WebSocket | null = null;
  private sessionActive: boolean = false;
  private keepAliveTimer: any = null;
  
  private email: string;
  private host: string;
  private port: number | string;
  private callback: (data: any) => void;

  constructor(config: AxpConfig) {
    console.log("axp2web.constructor() called: " + JSON.stringify(config));
    this.email = config.EMail;
    this.host = config.host;
    this.port = config.port;
    this.callback = config.callback;
    this.sessionActive = true;

    this.connect();
  }

  private connect() {
    const url = `wss://${this.host}:${this.port}/webSock`;
    this.ws = new WebSocket(url);

    this.ws.onopen = (obj) => {
      console.log("W2AXP: onopen: ", obj);
      this.send({ type: 'subscribe', email: this.email });
      this.callback({ type: 'status', status: 'success', data: 'connection established' });
    };

    this.ws.onclose = (obj) => {
      this.stopKeepAlive();
      if (!this.sessionActive) return;
      
      console.log("W2AXP: close: retrying...", obj);
      this.callback({ type: 'status', status: 'failure', data: 'closed-retrying' });
      // Retry connection
      setTimeout(() => this.connect(), 1000);
    };

    this.ws.onerror = (obj) => {
      this.callback({ type: 'status', status: 'failure', data: 'error' });
      console.log("W2AXP: error: ", obj);
    };

    this.ws.onmessage = (obj) => {
      const mobj = JSON.parse(obj.data);
      if (mobj.type === 'pong') return;
      this.callback(mobj);
    };

    // Start heartbeat loop safely
    this.startKeepAlive();
  }

  public send(obj: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const dataStr = JSON.stringify(obj);
      this.ws.send(dataStr);
      console.log("W2AXP: sending " + dataStr);
    }
  }

  private startKeepAlive() {
    if (this.keepAliveTimer) clearTimeout(this.keepAliveTimer);
    this.keepAliveTimer = setTimeout(() => this.keepAlive(), 10000);
  }

  private stopKeepAlive() {
    if (this.keepAliveTimer) {
      clearTimeout(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  private keepAlive() {
    if (!this.sessionActive) return;
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'ping' }));
    }
    this.startKeepAlive();
  }

  public close() {
    this.sessionActive = false;
    this.stopKeepAlive();
    
    if (this.ws) {
      this.ws.close();
    }
    this.callback({ type: 'status', status: 'success', data: 'connection closed' });
  }
}