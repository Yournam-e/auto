import { createEvent } from "effector";
import { GameAudioElements, GameAudioSettings } from "../../types";

export const setPlaying = createEvent<{
  audioName: keyof GameAudioElements;
  isPlaying: boolean;
}>();
export const stopPlaying = createEvent();
export const setGameAudio = createEvent<GameAudioElements>();
export const setSettings = createEvent<Partial<GameAudioSettings>>();
