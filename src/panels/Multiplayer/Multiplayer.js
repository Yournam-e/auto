import { useEffect, useState } from "react";

import {
  Button,
  ButtonGroup,
  Div,
  List,
  Panel,
  PanelHeader,
  Separator,
  Title,
} from "@vkontakte/vkui";

import {
  Icon20MessageOutline,
  Icon20QrCodeOutline,
  Icon20Sync,
  Icon24Play,
  Icon28ArrowUturnLeftOutline,
} from "@vkontakte/icons";
import "./../Multiplayer/Multiplayer.css";

import bridge from "@vkontakte/vk-bridge";

import {
  back,
  setActiveModal,
  setActivePanel,
  setActivePopout,
  useRouter,
} from "@blumjs/router";
import { isArray } from "@vkontakte/vkjs";
import { useStore } from "effector-react";
import { UserCell } from "../../atoms/UserCell";
import { ModalRoute, PanelRoute, PopoutRoute } from "../../constants/router";
import { AX } from "../../core/data/fetcher";
import {
  $main,
  getRoomInfo,
  isRoomExist,
  joinToYourRoom,
  setAgain,
  setAnswersInfo,
  setComplexity,
  setConnectType,
  setFirstStart,
  setGameInfo,
  setJoinCode,
  setLeavingRoom,
  setMpGameResults,
  setNotUserRoom,
  setOwnerId,
  setPlayerLobbyList,
  setPlayersId,
  setTaskInfo,
} from "../../core/main";
import { qsSign } from "../../hooks/qs-sign";
import { useTimeout } from "../../hooks/useTimeout";
import { useUserId } from "../../hooks/useUserId";
import {
  connectRoom,
  createRoom,
  joinRoom,
  leaveRoom,
  startGame,
} from "../../sockets/game";
import { client } from "../../sockets/receiver";

export const Multiplayer = ({ id }) => {
  const {
    gameInfo,
    playersId,
    joinCode,
    isFirstStart,
    playerLobbyList,
    connectType,
    haveHash,
    appearance,
    itAgain,
    leavingRoom,
    complexity,
    ownerId,
  } = useStore($main);
  const { activePanel } = useRouter();
  const thisUserId = useUserId();

  useEffect(() => {
    client.leftRoom = ({ userId }) => {
      console.log("fired left room", userId);
      if (
        userId !== thisUserId &&
        isArray(playerLobbyList) &&
        playersId &&
        activePanel === PanelRoute.Menu
      ) {
        setPlayerLobbyList(
          playerLobbyList.filter((item) => item.userId !== userId)
        );
        setPlayersId(playersId.filter((n) => n !== userId));
      }
    };
    client.gameStarted = ({ answers, task, id }) => {
      console.log("fired game started");
      setTaskInfo(task);
      setAnswersInfo(answers);
      setGameInfo({ ...gameInfo, taskId: id });
      setNotUserRoom(false);
      setActivePanel(PanelRoute.MultiplayerGame);
    };
    client.roomCreated = ({ roomId }) => {
      console.log(roomId, "created");
      joinRoom(roomId);
      setJoinCode(roomId);
      setNotUserRoom(false);
      back();
    };
    client.joinedRoom = ({ users }) => {
      console.log("joined room", users);
      if (users !== 0) {
        users.forEach((u) => u.isOwner && setOwnerId(u.userId));
        setPlayerLobbyList(users);
        setPlayersId(users.map((u) => u.userId));
      }
    };
    client.newOwner = ({ users }) => {
      if (isArray(users)) {
        users.forEach((u) => u.isOwner && setOwnerId(u.userId));
      }
    };
    client.gameStarted = ({ answers, task, id }) => {
      setTaskInfo(task);
      setAnswersInfo(answers);
      setGameInfo({ taskId: id, roomId: joinCode });
      setMpGameResults(null);
      setActivePanel(PanelRoute.MultiplayerGame);
    };
    return () => {
      client.leftRoom = () => {};
      client.gameStarted = () => {};
      client.roomCreated = () => {};
      client.joinedRoom = () => {};
      client.newOwner = () => {};
      client.gameStarted = () => {};
    };
  }, [activePanel, playerLobbyList, playersId, gameInfo, joinCode, thisUserId]);

  useEffect(() => {
    getRoomInfo({ thisUserId });
    if (haveHash && isFirstStart) {
      AX.post(`/api/plus-plus/room${qsSign}`)
        .then(async (response) => {
          console.log("connect to host", response.data);
          setJoinCode(window.location.hash.slice(1));
          setGameInfo({ ...gameInfo, roomId: response.data.data });
          if (window.location.hash.slice(1) === response.data.data) {
            setConnectType("host");
          }
          connectRoom(qsSign, window.location.hash.slice(1));
          setFirstStart(false);
        })
        .catch(function (error) {
          console.log("err connect to room", error);
        })
        .finally(() => {
          isRoomExist(window.location.hash.slice(1));
        });
    } else if (leavingRoom === true) {
      joinToYourRoom({ gameInfo, isFirstStart });
      setLeavingRoom(false);
    } else if (itAgain) {
      setGameInfo({ ...gameInfo, roomId: joinCode });
      setAgain(false);
    } else {
      joinToYourRoom({ gameInfo, isFirstStart });
    }
  }, []);

  useEffect(() => {
    if (ownerId === thisUserId && connectType === "join") {
      setConnectType("host");
    } else if (ownerId !== thisUserId && connectType === "host") {
      setConnectType("join");
    }
  }, [ownerId, thisUserId, connectType]);

  const [isCodeCopied, setCodeCopied] = useState(false);
  useTimeout(
    () => {
      if (isCodeCopied) {
        setCodeCopied(false);
      }
    },
    1500,
    [isCodeCopied]
  );

  return (
    <Panel id={id}>
      {connectType === "join" && (
        <PanelHeader
          style={{ backgroundColor: "transparent" }}
          transparent={true}
          shadow={false}
          separator={false}
        />
      )}

      {connectType === "host" && (
        <PanelHeader
          style={{ backgroundColor: "transparent" }}
          transparent={true}
          shadow={false}
          separator={false}
        />
      )}

      <Div className="multiplayer-div">
        <div style={{ paddingLeft: "auto", paddingRight: "auto" }}>
          <Title className="multiplayer-title" style={{ textAlign: "center" }}>
            {connectType === "host"
              ? "Пригласите друга в лобби"
              : "Лобби друга"}
          </Title>

          <div style={{ height: 30 }} className="multiplayer-title-div">
            <Title
              className={`multiplayer-title-code${
                joinCode && !isCodeCopied ? " trigger-change-code" : ""
              }`}
              style={{
                display: "inline-block",
                paddingLeft: 5,
              }}
              onClick={() => {
                if (!isCodeCopied) {
                  bridge
                    .send("VKWebAppCopyText", { text: joinCode })
                    .then(() => setCodeCopied(true));
                }
              }}
            >
              {isCodeCopied ? "Код скопирован" : joinCode}
            </Title>
            {connectType === "host" && !isCodeCopied && (
              <Icon20Sync
                className={`multiplayer-title-return${
                  joinCode ? " trigger-change-code-reverse" : ""
                }`}
                fill="#1A84FF"
                onClick={async function () {
                  setActivePopout(PopoutRoute.Loading);
                  createRoom(joinCode);
                  setJoinCode(null);
                }}
                style={{
                  display: "inline-block",
                  paddingLeft: 5,
                  verticalAlign: "middle",
                }}
              />
            )}
          </div>

          <div className="multiplayer-qr-button-div">
            <Button
              className="multiplayer-qr-button"
              style={{
                backgroundColor: appearance === "dark" ? "#293950" : "#F4F9FF",
                color: "#1984FF",
              }}
              onClick={() => {
                setActiveModal(ModalRoute.InputCodeQR);
              }}
              before={<Icon20QrCodeOutline />}
              mode="secondary"
            >
              Поделиться QR
            </Button>
          </div>
          {false && (
            <div className="multiplayer-qr-button-div">
              <Button
                className="multiplayer-qr-button"
                style={{
                  backgroundColor:
                    appearance === "dark" ? "#293950" : "#F4F9FF",
                  color: "#1984FF",
                }}
                onClick={() => {
                  bridge
                    .send("VKWebAppAddToChat", {
                      action_title: "Присоединиться к лобби",
                      hash: joinCode,
                    })
                    .then((data) => {
                      console.log(data);
                    })
                    .catch((error) => {
                      console.log("addToChat err", error);
                      if (error) {
                        setActivePopout(PopoutRoute.AlertShareGame);
                      }
                    });
                }}
                before={<Icon20MessageOutline width={22} height={22} />}
                mode="secondary"
              >
                Пригласить чат
              </Button>
            </div>
          )}

          {connectType === "host" && (
            <div>
              <div className="multiplayer-separator-div">
                <div className="separator-left">
                  <Separator />
                </div>

                <div style={{ marginTop: -8 }}>
                  <Title className="title-or">или</Title>
                </div>

                <div className="separator-right">
                  <Separator />
                </div>
              </div>

              <div className="multiplayer-qr-button-div">
                <Button
                  className="multiplayer-code-button"
                  style={{
                    backgroundColor:
                      appearance === "dark" ? "#293950" : "#F4F9FF",
                    color: "#1984FF",
                  }}
                  onClick={() => {
                    setActiveModal(ModalRoute.InputCode);
                  }}
                  mode="secondary"
                >
                  Присоединиться по коду
                </Button>
              </div>
            </div>
          )}
        </div>
        <List
          style={{
            marginTop: 16,
            marginBottom: 16,
            height: 60 * 4,
            overflowY: "auto",
          }}
        >
          {[
            0,
            1,
            2,
            3,
            ...new Array(
              playerLobbyList && playerLobbyList.length > 4
                ? playerLobbyList.length - 4
                : 0
            ).fill(0),
          ].map((_, i) => (
            <UserCell
              name={playerLobbyList[i] ? playerLobbyList[i].name : undefined}
              avatar={
                playerLobbyList[i] ? playerLobbyList[i].avatar : undefined
              }
              key={i}
            />
          ))}
        </List>
        <div className="multiplayer-play-group">
          {connectType === "host" && (
            <Div>
              <ButtonGroup
                stretched
                className="multiplayer-complexity-div"
                align="center"
                mode="horizontal"
                gap="space"
              >
                <Button
                  size="s"
                  appearance="accent"
                  mode="tertiary"
                  gap="m"
                  stretched
                  style={{
                    color: complexity === "easy" ? "#1984FF" : "#99A2AD",
                  }}
                  className={
                    complexity === "easy"
                      ? appearance === "light"
                        ? "complexity-button-on-light"
                        : "complexity-button-on-dark"
                      : "complexity-button-off"
                  }
                  onClick={() => {
                    setComplexity("easy");
                  }}
                >
                  Легко
                </Button>
                <Button
                  size="s"
                  appearance="accent"
                  mode="tertiary"
                  gap="m"
                  stretched
                  style={{
                    color: complexity === "mid" ? "#1984FF" : "#99A2AD",
                  }}
                  className={
                    complexity === "mid"
                      ? appearance === "light"
                        ? "complexity-button-on-light"
                        : "complexity-button-on-dark"
                      : "complexity-button-off"
                  }
                  onClick={() => {
                    setComplexity("mid");
                  }}
                >
                  Средне
                </Button>
                <Button
                  appearance="accent"
                  mode="tertiary"
                  gap="m"
                  stretched
                  style={{
                    color: complexity === "hard" ? "#1984FF" : "#99A2AD",
                  }}
                  className={
                    complexity === "hard"
                      ? appearance === "light"
                        ? "complexity-button-on-light"
                        : "complexity-button-on-dark"
                      : "complexity-button-off"
                  }
                  onClick={() => {
                    setComplexity("hard");
                  }}
                >
                  Сложно
                </Button>
              </ButtonGroup>
            </Div>
          )}
          <ButtonGroup
            gap="space"
            style={{ marginTop: 10 }}
            className="multiplayer-play-div"
          >
            <Button
              size="l"
              className="multiplayer-play-button"
              appearance="accent"
              style={{
                background:
                  connectType === "host"
                    ? "#1A84FF"
                    : appearance === "dark"
                    ? "#293950"
                    : "#EBF1FA",
                color: connectType === "host" ? "#fff" : "#1A84FF",
              }}
              before={
                connectType === "host" ? (
                  <Icon24Play />
                ) : (
                  <div>
                    <Icon28ArrowUturnLeftOutline />
                  </div>
                )
              }
              stretched
              onClick={() => {
                if (connectType === "join") {
                  setConnectType("host");
                  joinToYourRoom({ gameInfo, isFirstStart });
                  leaveRoom(joinCode);
                } else {
                  startGame(joinCode, complexity, playersId);
                }
              }}
            >
              {connectType === "host" ? "Играть" : "Выйти"}
            </Button>
          </ButtonGroup>
        </div>
      </Div>
    </Panel>
  );
};
