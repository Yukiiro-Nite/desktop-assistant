// Copied from https://github.com/xenova/whisper-web/blob/81869ed62970ff4373509b6004a6c9a3f0c5b64d/src/hooks/useWorker.ts
import { useState } from "react";
import TranscriberWorker from "../workers/worker.js?worker"

export interface MessageEventHandler {
    (event: MessageEvent): void;
}

export function useWorker(messageEventHandler: MessageEventHandler): Worker {
    // Create new worker once and never again
    const [worker] = useState(() => createWorker(messageEventHandler));
    return worker;
}

function createWorker(messageEventHandler: MessageEventHandler): Worker {
    const worker = new TranscriberWorker()
    // Listen for messages from the Web Worker
    worker.addEventListener("message", messageEventHandler);
    return worker;
}