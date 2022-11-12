import io, { Socket } from "socket.io-client";
import { initCallbacks } from "./callbacks";

const ns = "https://showtime.app-dich.com/plusplus";

let connected = false;

let socket: Socket;

export const connectRoom = (query: string, roomId: string, userId: number) => {
  console.log("connecting");
  if (connected) return;
  socket = io(ns, {
    query: {
      sign: query.replace(/\?vk_/g, "vk_"),
    },
    transports: ["polling"],
  });

  socket.on("connect", () => {
    console.debug("ws connected");
    initCallbacks(socket);
    connected = true;

    joinRoom(roomId, userId);
  });
  socket.on("disconnect", () => {
    console.debug("ws disconnected");
    connected = false;
  });
};

export const joinRoom = (roomId: string, userId: number) => {
  socket.emit("joinRoom", { roomId, userId });
};
export const leaveRoom = (roomId: string, userId: number) => {
  socket.emit("leaveRoom", { roomId, userId });
};
export const createRoom = (userId: number, prevRoomId: string) => {
  socket.emit("createRoom", { userId, prevRoomId });
};
export const startGame = (
  roomId: string,
  userId: number,
  difficulty: "easy" | "mid" | "hard",
  userIds: number[]
) => {
  socket.emit("startGame", { roomId, userId, difficulty, userIds });
};
export const answerTask = (
  roomId: string,
  userId: number,
  answer: number,
  taskId: string
) => {
  socket.emit("answerTask", { roomId, userId, answer, taskId });
};