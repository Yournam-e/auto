import { createStore } from "effector";
import { GameAudioElements, GameAudioSettings } from "../../types";
import { setGameAudio, setSettings } from "./events";

type Store = {
  gameAudio: GameAudioElements;
  settings: GameAudioSettings;
  isPlaying: boolean;
};

export const $audioPlayer = createStore<Store>({
  gameAudio: {
    timeOver: null,
    during: null,
    finishSuccess: null,
    finishFailed: null,
    replySuccess: null,
    replyFailed: null,
  },
  settings: {
    timeOver: true,
    during: true,
    finishSuccess: true,
    finishFailed: true,
    replySuccess: true,
    replyFailed: true,
  },
  isPlaying: false,
})
  .on(setGameAudio, (s, gameAudio) => ({ ...s, gameAudio }))
  .on(setSettings, (s, settings) => ({
    ...s,
    settings: {
      ...s.settings,
      ...settings,
    },
  }));
