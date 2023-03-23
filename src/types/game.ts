export type GameInfo = {
  roomId: string;
  taskId: string;
};

export type ConnectType = "host" | "join";
export type Complexity = "easy" | "mid" | "hard";
export type BestLvlResult = {
  lvlType: string;
  bestTime: {
    seconds: number;
    milliseconds: number;
  };
  best: number;
};
export type MultiplayerGameResult = {
  difficulty: string | null;
  players: {
    userId: number;
    rightResults: number;
    totalResults: number;
  }[];
};

type GameAudio<T> = {
  timeOver: T;
  during: T;
  finishSuccess: T;
  finishFailed: T;
  replySuccess: T;
  replyFailed: T;
};
export type GameAudioElements = GameAudio<HTMLAudioElement | null>;
export type GameAudioSettings = GameAudio<boolean>;
