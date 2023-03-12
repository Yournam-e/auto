import { useEffect } from "react";

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
import axios from "axios";
import { useStore } from "effector-react";
import { UserCell } from "../../atoms/UserCell";
import { ModalRoute, PanelRoute, PopoutRoute } from "../../constants/router";
import {
  $main,
  joinToYourRoom,
  setAgain,
  setAnswersInfo,
  setComplexity,
  setConnectType,
  setFirstStart,
  setGameExists,
  setGameInfo,
  setJoinCode,
  setLeavingRoom,
  setNotUserRoom,
  setPlayerLobbyList,
  setPlayersId,
  setTaskInfo,
} from "../../core/main";
import { qsSign } from "../../hooks/qs-sign";
import { useUserId } from "../../hooks/useUserId";
import { browserBack } from "../../scripts/browserBack";
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
    user,
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
    notUserRoom,
    complexity,
  } = useStore($main);
  const { activePanel } = useRouter();
  const thisUserId = useUserId();

  var clickTime = 0;

  client.leftRoom = ({ userId }) => {
    console.log("fired left room");
    if (userId && activePanel === PanelRoute.Menu) {
      setPlayerLobbyList((pLL) => pLL.filter((item) => item.userId !== userId));
      setPlayersId((p) => p.filter((n) => n !== userId));
    }
  };

  client.gameStarted = ({ answers, task, id }) => {
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
  useEffect(() => {
    const bridgeHandler = (e) => {
      console.log("bridge event", e.detail.type);
      if (e.detail.type === "VKWebAppViewHide") {
        if (connectType === "join") {
          setConnectType("host");
          joinToYourRoom({ gameInfo, isFirstStart });
          leaveRoom(user.id);
        }
      }
      if (e.detail.type === "VKWebAppViewRestore") {
        setConnectType("host");
        joinToYourRoom({ gameInfo, isFirstStart });
        leaveRoom(user.id);
        back();
      }
    };
    bridge.subscribe(bridgeHandler);
    return () => {
      bridge.unsubscribe(bridgeHandler);
    };
  }, [gameInfo, isFirstStart, user]);

  useEffect(() => {
    axios
      .get(`https://showtime.app-dich.com/api/plus-plus/user-games${qsSign}`)
      .then(async function (response) {
        await response;
        console.log(response.data.data[0], "user-games");
        console.log(response.data.data[0].roomId);
        console.log(window.location.hash.slice(1));
        if (response.data.data[0].ownerId === useUserId) {
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

    if (haveHash && isFirstStart) {
      axios
        .post(`https://showtime.app-dich.com/api/plus-plus/room${qsSign}`)
        .then(async (response) => {
          console.log(response);
          setJoinCode(response.data.data);

          setGameInfo({ ...gameInfo, roomId: response.data.data });
          if (window.location.hash.slice(1) === response.data.data) {
            setConnectType("host");
            setJoinCode(window.location.hash.slice(1));
            connectRoom(qsSign, window.location.hash.slice(1), thisUserId);
          } else {
            setJoinCode(window.location.hash.slice(1));
            connectRoom(qsSign, window.location.hash.slice(1), thisUserId);
            setNotUserRoom(true);
          }
          setFirstStart(false);
        })
        .catch(function (error) {
          console.log("err connect to room", error);
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

  client.gameStarted = ({ answers, task, id }) => {
    setTaskInfo(task);
    setAnswersInfo(answers);
    setGameInfo({ taskId: id, roomId: joinCode });
    setActivePanel(PanelRoute.MultiplayerGame);
  };

  useEffect(() => {
    if (connectType === "join" && playerLobbyList.length === 1 && notUserRoom) {
      setActivePopout(PopoutRoute.AlertLobbyNotExist);
    }
  }, [playerLobbyList.length, connectType, notUserRoom]);

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
              className="multiplayer-title-code"
              style={{
                display: "inline-block",
                paddingLeft: 5,
              }}
              onClick={() => {
                bridge.send("VKWebAppCopyText", { text: joinCode });
              }}
            >
              {joinCode}
            </Title>

            {connectType === "host" && (
              <Icon20Sync
                className="multiplayer-title-return"
                fill="#1A84FF"
                onClick={async function () {
                  setActivePopout(PopoutRoute.Loading);
                  createRoom(joinCode);

                  setPlayerLobbyList((pLL) =>
                    pLL.filter((item) => item.userId === user.id)
                  );
                  setPlayersId((p) => p.filter((n) => n === user.id));
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

        {user && connectType === "host" ? (
          <List style={{ marginTop: 16, marginBottom: 16 }}>
            <UserCell
              name={`${user.first_name} ${user.last_name}`}
              avatar={user.photo_200}
            />
            {[0, 1, 2, 3]
              .filter(
                (i) =>
                  !playerLobbyList[i] ||
                  (playerLobbyList[i] && playerLobbyList[i].userId != user.id)
              )
              .slice(0, 3)
              .map((i) => (
                <UserCell
                  name={
                    playerLobbyList[i] ? playerLobbyList[i].name : undefined
                  }
                  avatar={
                    playerLobbyList[i] ? playerLobbyList[i].avatar : undefined
                  }
                  key={i}
                />
              ))}
          </List>
        ) : (
          <List>
            {[0, 1, 2, 3].map((i) => (
              <UserCell
                name={playerLobbyList[i] ? playerLobbyList[i].name : undefined}
                avatar={
                  playerLobbyList[i] ? playerLobbyList[i].avatar : undefined
                }
                key={i}
              />
            ))}
          </List>
        )}

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
                  leaveRoom(user.id);
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
