import bridge from "@vkontakte/vk-bridge";
import { isArray } from "@vkontakte/vkjs";
import { createEffect } from "effector";
import { GameAudioElements } from "../../types";
import { setGameAudio, setSettings } from "./events";

export const loadGameAudio = createEffect(() => {
  const gameAudio: GameAudioElements = {
    timeOver: new Audio(""),
    during: new Audio(""),
    finishSuccess: new Audio(""),
    finishFailed: new Audio(""),
    replySuccess: new Audio(""),
    replyFailed: new Audio(""),
  };
  let countLoadedAudio = 0;
  Object.keys(gameAudio).forEach((key) => {
    //@ts-ignore
    gameAudio[key as keyof GameAudioElements]?.onload(() => {
      countLoadedAudio++;
    });
  });
  const intervalId = setInterval(() => {
    if (countLoadedAudio === Object.keys(gameAudio).length) {
      setGameAudio(gameAudio);
      clearInterval(intervalId);
    }
  }, 500);
});
export const loadGameAudioSettings = createEffect(async () => {
  try {
    const { keys } = await bridge.send("VKWebAppStorageGetKeys");
    if (isArray(keys) && keys.length > 0) {
      const storage = await bridge.send("VKWebAppStorageGet");
      if (storage.keys) {
        storage.keys.forEach((s) => {
          const settingParam: Partial<any> = {};
          settingParam[s.key] = s.value;
          setSettings(settingParam);
        });
      }
    }
  } catch (e) {
    console.log("get keys err", e);
  }
});
