import { Platform } from "@vkontakte/vkui";
import { createEvent } from "effector";
import { StoryRoute } from "../../constants/router";
import {
  Appearance,
  BestLvlResult,
  Complexity,
  ConnectType,
  GameInfo,
} from "../../types";

export const setAppearance = createEvent<Appearance>();
export const setActiveStory = createEvent<StoryRoute>();
export const setUser = createEvent<any>();
export const setPlatform = createEvent<Platform>();
export const setCountPoints = createEvent<number>();
export const setGameInfo = createEvent<GameInfo>();
export const setTaskInfo = createEvent<any>();
export const setAnswersInfo = createEvent<any>();
export const setJoinCode = createEvent<null | string>();
export const setMpGameResults = createEvent<any[]>();
export const setPlayersId = createEvent<number[]>();
export const setFirstStart = createEvent<boolean>();
export const setPlayerLobbyList = createEvent<any[]>();
export const setConnectType = createEvent<ConnectType>();
export const setItNeedRestartGame = createEvent<boolean>();
export const setNotAdd = createEvent<boolean>();
export const setLeavingRoom = createEvent<any>();
export const setHaveHash = createEvent<string>();
export const setPanelsHistory = createEvent<any[]>();
export const setSingleType = createEvent<any>();
export const setLocalTask = createEvent<any>();
export const setLvlsInfo = createEvent<any>();
export const setTimeFinish = createEvent<number>();
export const setReady = createEvent<boolean>();
export const setLvlNumber = createEvent<number>();
export const setCompleteLvl = createEvent<any>();
export const setAllTasks = createEvent<any>();
export const setLvlResult = createEvent<{
  id: any;
  lvlType: any;
  answers: any[];
}>();
export const setAnswer = createEvent<{
  id: any;
  lvlType: any;
  answers: any[];
}>();
export const setLvlData = createEvent<any>();
export const setGameExists = createEvent<boolean>();
export const setAgain = createEvent<boolean>();
export const setNotUserRoom = createEvent<boolean>();
export const setComplexity = createEvent<Complexity>();
export const setBestLvlsResult = createEvent<BestLvlResult[]>();
export const setOwnerId = createEvent<number>();
