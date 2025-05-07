import axios from "axios";
import WebSocket from "ws";
import https from "https";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // WARNING: disables SSL verification
});

export type TTSFormat = "wav" | "mp3" | "ogg" | "aac" | "flac";

export interface TTSRequest {
  model: string;
  text: string;
  format: TTSFormat;
}

export interface TTSClientOptions {
  token: string;
}

export class TTS {
  private token: string;
  private readonly httpURL = "https://oyqiz.airi.uz/api/v2/tts";
  private readonly wsURL = "ws://oyqiz.airi.uz/stream";

  constructor(options: TTSClientOptions) {
    this.token = options.token;
  }

  async single(data: TTSRequest): Promise<Buffer> {
    const response = await axios.post(this.httpURL, data, {
      responseType: "arraybuffer",
      headers: {
        token: `${this.token}`,
      },
      httpsAgent,
    });

    return Buffer.from(response.data);
  }

  stream(
    data: TTSRequest,
    callback: (
      err: Error | null,
      chunk: Buffer | null,
      close: () => void
    ) => void
  ): void {
    const url = new URL(this.wsURL);
    url.searchParams.set("model", data.model);
    url.searchParams.set("text", data.text);
    url.searchParams.set("format", data.format);

    const ws = new WebSocket(url.toString(), {
      headers: {
        token: `${this.token}`,
      },
    });

    const close = () => ws.close();

    ws.on("message", (message: WebSocket.RawData) => {
      let buffer: Buffer;

      if (typeof message === "string") {
        buffer = Buffer.from(message);
      } else if (message instanceof Buffer) {
        buffer = message;
      } else if (message instanceof ArrayBuffer) {
        buffer = Buffer.from(new Uint8Array(message));
      } else if (Array.isArray(message)) {
        buffer = Buffer.concat(message);
      } else {
        return callback(new Error("Unsupported message format"), null, close);
      }

      callback(null, buffer, close);
    });

    ws.on("error", (err) => {
      callback(err, null, close);
    });

    ws.on("close", () => {
      callback(null, null, close);
    });
  }
}
