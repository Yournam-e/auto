import { setActivePanel } from "@blumjs/router";
import axios from "axios";
import { createEffect } from "effector";
import { PanelRoute } from "../../constants/router";
import { qsSign } from "../../hooks/qs-sign";
import { connectRoom, joinRoom } from "../../sockets/game";
import { GameInfo } from "../../types";
import {
  setFirstStart,
  setGameInfo,
  setJoinCode,
  setNotUserRoom,
  setSingleType,
} from "./events";

type JoinToYourRoom = {
  gameInfo: GameInfo;
  isFirstStart: boolean;
};
export const joinToYourRoom = createEffect<JoinToYourRoom, void>(
  ({ gameInfo, isFirstStart }) => {
    axios
      .post(`https://showtime.app-dich.com/api/plus-plus/room${qsSign}`)
      .then(async function (response) {
        setJoinCode(response.data.data);

        setGameInfo({ ...gameInfo, roomId: response.data.data });
        if (isFirstStart) {
          connectRoom(qsSign, response.data.data);
        } else {
          joinRoom(response.data.data);
          setNotUserRoom(false);
        }

        setFirstStart(false);
      })
      .catch((error) => {
        console.log("join to room err", error);
      });
  }
);

export const checkToDelete = createEffect<any, void>((lvlsInfo) => {
  setSingleType("single30");
  setActivePanel(PanelRoute.TemporaryGame);
  if (lvlsInfo) {
    console.log("lvlsInfo check to delete start", lvlsInfo);
    lvlsInfo.map((item: any) => {
      if (item.lvlType === "single30") {
        axios
          .delete(
            `https://showtime.app-dich.com/api/plus-plus/lvl/${item.id}${qsSign}`
          )
          .then(async function (response) {
            console.log("check to delete ok", response);
          })
          .catch(function (error) {
            console.log("check to delete err", error);
          });
      }
    });
  }
});
