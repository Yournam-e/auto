import { MultiplayerGameResult } from "../types";
import { clientPerformCallback } from "./callbacks";

export const client = clientPerformCallback((m) => ({
  gameStarted:
    m<
      (data: {
        task: (string | number)[];
        answers: number[];
        id: string;
      }) => void
    >(),
  roomCreated: m<(data: { roomId: string }) => void>(),
  nextTask:
    m<(data: { task: (string | number)[]; answers: number[] }) => void>(),
  gameFinished: m<(data: { game: MultiplayerGameResult | null }) => void>(),
  lvlFinished:
    m<(data: { lvlId: string; userId: number; id: string }) => void>(),
  joinedRoom: m<
    (data: {
      users: {
        userId: number;
        avatar: string;
        name: string;
        firstName: string;
        lastName: string;
      }[];
    }) => void
  >(),
  leftRoom: m<(data: { userId: number }) => void>(),
  activeDevice: m<() => void>(),
}));
