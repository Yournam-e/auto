import io, { Socket } from "socket.io-client";
import { initCallbacks } from "./callbacks";

const ns = "https://showtime.app-dich.com/plusplus";

let connected = false;

let socket: Socket;

export const connectRoom = (query: string, roomId: string) => {
  console.log("connecting");
  if (connected) return;
  socket = io(ns, {
    query: {
      sign: query.replace(/\?vk_/g, "vk_"),
    },
    transports: ["polling"],
  });

  initCallbacks(socket);
  socket.on("connect", () => {
    console.debug("ws connected");
    connected = true;

    joinRoom(roomId);
  });
  socket.on("disconnect", () => {
    console.debug("ws disconnected");
    connected = false;
  });
};

export const joinRoom = (roomId: string) => {
  socket.emit("joinRoom", { roomId });
};
export const leaveRoom = (roomId: string) => {
  socket.emit("leaveRoom", { roomId });
};
export const createRoom = (prevRoomId: string) => {
  socket.emit("createRoom", { prevRoomId });
};
export const startGame = (
  roomId: string,
  difficulty: "easy" | "mid" | "hard",
  userIds: number[]
) => {
  socket.emit("startGame", { roomId, difficulty, userIds });
};
export const answerTask = (roomId: string, answer: number, taskId: string) => {
  socket.emit("answerTask", { roomId, answer, taskId });
};
