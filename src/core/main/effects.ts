import {
  back,
  setActivePanel,
  setActivePopout,
  setActiveViewPanel,
} from "@blumjs/router";
import { createEffect } from "effector";
import {
  ModalRoute,
  PanelRoute,
  PopoutRoute,
  ViewRoute,
} from "../../constants/router";
import { qsSign } from "../../hooks/qs-sign";
import { browserBack } from "../../scripts/browserBack";
import { connectRoom, joinRoom } from "../../sockets/game";
import { BestLvlResult, GameInfo } from "../../types";
import { AX } from "../data/fetcher";
import {
  setBestLvlsResult,
  setFirstStart,
  setGameExists,
  setGameInfo,
  setJoinCode,
  setNotUserRoom,
  setOwnerId,
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

export const toOffline = createEffect(() => {
  setActiveViewPanel({
    view: ViewRoute.Main,
    panel: PanelRoute.NotConnection,
  });
});

export const getRoomInfo = createEffect<{ thisUserId: number }, void>(
  ({ thisUserId }) => {
    AX.get(`/api/plus-plus/user-games${qsSign}`)
      .then(async function (response) {
        console.log(response.data.data[0], "user-games", window.location.hash);
        setOwnerId(response.data.data[0].ownerId);
        if (response.data.data[0].ownerId === thisUserId) {
          if (response.data.data[0].started) {
            browserBack();
            setGameExists(true);
          }
        }
        if (response.data.data[0].roomId === window.location.hash.slice(1)) {
          if (response.data.data[0].started) {
            browserBack();
            setGameExists(true);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
);
export const isRoomExist = createEffect<number, void>((roomId) => {
  AX.get<{ data: boolean }>(`/api/plus-plus/room/exists/${roomId}${qsSign}`)
    .then((res) => {
      if (!res.data.data) {
        setActivePopout(PopoutRoute.AlertLobbyNotExist);
      }
    })
    .catch((res) => {
      setActivePopout(PopoutRoute.AlertLobbyNotExist);
      console.log("err", res);
    });
});

export const cleanUpperLayout = createEffect<
  { activePopout: PopoutRoute; activeModal: ModalRoute; callback: () => void },
  void
>(({ activePopout, activeModal, callback }) => {
  if (activePopout) {
    back({
      afterBackHandledCallback: () => {
        if (activeModal) {
          back({
            afterBackHandledCallback: callback,
          });
        } else {
          callback();
        }
      },
    });
  } else if (activeModal) {
    back({
      afterBackHandledCallback: () => {
        if (activePopout) {
          back({
            afterBackHandledCallback: callback,
          });
        } else {
          callback();
        }
      },
    });
  } else {
    callback();
  }
});
