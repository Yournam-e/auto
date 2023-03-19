import { back, setActivePanel } from "@blumjs/router";
import { createEffect } from "effector";
import { PanelRoute, PopoutRoute } from "../../constants/router";
import { qsSign } from "../../hooks/qs-sign";
import { connectRoom, joinRoom } from "../../sockets/game";
import { BestLvlResult, GameInfo } from "../../types";
import { AX } from "../data/fetcher";
import {
  setBestLvlsResult,
  setFirstStart,
  setGameInfo,
  setJoinCode,
  setNotUserRoom,
  setSingleType,
  setTimeFinish,
} from "./events";

type JoinToYourRoom = {
  gameInfo: GameInfo;
  isFirstStart: boolean;
};
export const joinToYourRoom = createEffect<JoinToYourRoom, void>(
  ({ gameInfo, isFirstStart }) => {
    AX.post(`/api/plus-plus/room${qsSign}`)
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
        AX.delete(`/api/plus-plus/lvl/${item.id}${qsSign}`)
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

export const loadBestLvlsResult = createEffect(() => {
  AX.get<{ data: BestLvlResult[] }>(`/api/plus-plus/best${qsSign}`)
    .then((res) => {
      setBestLvlsResult(res.data.data);
    })
    .catch((e) => {
      console.log("loadBestLvlsResult err", e);
    });
});

export const finishGame = createEffect<
  { activePopout?: PopoutRoute | null; activePanel: PanelRoute },
  void
>(({ activePanel, activePopout }) => {
  console.log("finishing lvl");
  setTimeFinish(Date.now());
  if (activePopout === PopoutRoute.AlertFinishGame) {
    back({
      afterBackHandledCallback: () => {
        setActivePanel(activePanel);
      },
    });
  } else {
    setActivePanel(activePanel);
  }
});
