// From https://github.com/ncdai/chanhdai.com/blob/main/src/hooks/use-sound.ts
// Thank you, Chánh Đại 🙏

import { useCallback, useEffect, useRef } from "react";

/**
 * Custom React hook to load and play a sound from a given URL using the Web Audio API.
 *
 * This hook fetches the audio file at the specified URL, decodes it, and prepares it for playback.
 * It returns a `play` function that can be called to play the loaded sound.
 *
 * @param url - The URL of the audio file to load and play.
 * @returns A function that, when called, plays the loaded sound.
 *
 * @remarks
 * - If the Web Audio API is not supported in the browser, a warning is logged and playback is disabled.
 * - The audio context and buffer are managed internally using React refs.
 * - Errors during fetching or decoding the audio are logged to the console.
 *
 * @example
 * ```tsx
 * const playClick = useSound('/sounds/click.mp3');
 * // Later in an event handler:
 * playClick();
 * ```
 */
export function useSound(url: string) {
  const audioContextClassRef = useRef<
    (typeof AudioContext & { new (): AudioContext }) | null
  >(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const loadingBufferPromiseRef = useRef<Promise<AudioBuffer> | null>(null);

  useEffect(() => {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) {
      console.warn("Web Audio API is not supported in this browser.");
      return;
    }

    audioContextClassRef.current = AudioContextClass;

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, []);

  const play = useCallback(async () => {
    if (!audioContextClassRef.current) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new audioContextClassRef.current();
    }

    const audioCtx = audioCtxRef.current;

    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    if (!bufferRef.current) {
      if (!loadingBufferPromiseRef.current) {
        loadingBufferPromiseRef.current = fetch(url)
          .then((res) => res.arrayBuffer())
          .then((data) => audioCtx.decodeAudioData(data));
      }

      try {
        bufferRef.current = await loadingBufferPromiseRef.current;
      } catch (err) {
        console.log(`Failed to load click sound from ${url}:`, err);
        return;
      } finally {
        loadingBufferPromiseRef.current = null;
      }
    }

    const source = audioCtx.createBufferSource();
    source.buffer = bufferRef.current;
    source.connect(audioCtx.destination);
    source.start(0);
  }, [url]);

  return play;
}
