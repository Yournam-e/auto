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
};
