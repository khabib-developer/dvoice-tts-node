# dvoice-tts

A Node.js + TypeScript client for the DVoice TTS API, enabling text-to-speech conversion with support for single audio generation and real-time audio streaming via WebSocket.

## 🚀 Features

- Generate audio files in multiple formats (`mp3`, `wav`, `ogg`, `aac`, `flac`).
- Stream audio in real-time for dynamic applications.
- Simple and intuitive API for quick integration.
- TypeScript support for type-safe development.

## 📦 Installation

Install the package using npm:

```bash
npm install dvoice-tts
```

## 🧠 Usage

### Importing the Client

```typescript
import { TTS } from "dvoice-tts";
```

### Creating a Client

Initialize the TTS client with your API token:

```typescript
const tts = new TTS({ token: "YOUR_API_TOKEN" });
```

Replace `'YOUR_API_TOKEN'` with your actual API token from the DVoice TTS service.

### 🔊 Generating a Single Audio File

Use the `single()` method to generate an audio file from text:

```typescript
import * as fs from "fs";

async function generateAudio() {
  try {
    const audio = await tts.single({
      model: "default",
      text: "Hello, world!",
      format: "mp3", // Options: 'mp3', 'wav', 'ogg', 'aac', 'flac'
    });
    fs.writeFileSync("output.mp3", audio);
    console.log("Audio file saved as output.mp3");
  } catch (error) {
    console.error("Error generating audio:", error);
  }
}

generateAudio();
```

### 🌊 Real-Time Audio Streaming

Use the `stream()` method to receive audio chunks in real-time:

```typescript
tts.stream(
  {
    model: "default",
    text: "Streaming speech in real-time!",
    format: "mp3", // Options: 'mp3', 'wav', 'ogg', 'aac', 'flac'
  },
  (err, chunk, close) => {
    if (err) {
      console.error("Stream error:", err);
      close(); // Close the connection on error
    } else if (chunk) {
      // Process the audio chunk (e.g., feed to an audio player)
      console.log("Received audio chunk:", chunk.length, "bytes");
    } else {
      // Stream has ended
      console.log("Stream completed");
      close(); // Close the connection
    }
  }
);
```

The `close()` function can be called to terminate the WebSocket connection manually.

## 📜 API Reference

### `new TTS(options)`

Creates a new TTS client instance.

- **Parameters**:
  - `options.token` (string): Your API token for DVoice TTS authentication.

### `tts.single(options)`

Generates a single audio file from text.

- **Parameters**:
  - `options.model` (string): The TTS model to use (e.g., `'default'`).
  - `options.text` (string): The text to convert to speech.
  - `options.format` (string): Audio format (`'mp3'`, `'wav'`, `'ogg'`, `'aac'`, `'flac'`).
- **Returns**: `Promise<Buffer>` - A promise resolving to a Buffer containing the audio data.
- **Throws**: Error if the request fails.

### `tts.stream(options, callback)`

Streams audio chunks in real-time over WebSocket.

- **Parameters**:
  - `options.model` (string): The TTS model to use (e.g., `'default'`).
  - `options.text` (string): The text to convert to speech.
  - `options.format` (string): Audio format (`'mp3'`, `'wav'`, `'ogg'`, `'aac'`, `'flac'`).
  - `callback` (function): Called with `(err, chunk, close)`:
    - `err` (Error | null): Any error that occurs.
    - `chunk` (Buffer | null): Audio data chunk, or `null` if the stream ends.
    - `close` (function): Function to close the WebSocket connection.
- **Returns**: `void`

## 🛠️ Error Handling

Both `single()` and `stream()` methods include error handling:

- For `single()`, errors are thrown and can be caught using `try/catch`.
- For `stream()`, errors are passed to the callback as the `err` parameter.

Example:

```typescript
try {
  const audio = await tts.single({
    model: "default",
    text: "Test",
    format: "mp3",
  });
} catch (error) {
  console.error("Failed to generate audio:", error.message);
}
```

## 📝 Notes

- Ensure a valid API token is provided to authenticate with the DVoice TTS API.
- The `stream()` method is ideal for applications requiring low-latency audio, such as live voice assistants or interactive systems.
- Check the DVoice TTS API documentation for supported models and additional configuration options.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🌟 Contributing

Contributions are welcome! Please submit a pull request or open an issue on the GitHub repository for bug reports, feature requests, or improvements.
