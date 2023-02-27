import { useEffect, useState } from "react";

import {
  Avatar,
  Button,
  ButtonGroup,
  Cell,
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
  setActiveModal,
  setActivePanel,
  setActivePopout,
} from "@blumjs/router";
import axios from "axios";
import { useStore } from "effector-react";
import {
  ModalRoute,
  PanelRoute,
  PopoutRoute,
  StoryRoute,
} from "../../constants/router";
import {
  $main,
  joinToYourRoom,
  setActiveStory,
  setAnswersInfo,
  setConnectType,
  setFirstStart,
  setGameExists,
  setGameInfo,
  setJoinCode,
  setNotUserRoom,
  setTaskInfo,
} from "../../core/main";
import { qsSign } from "../../hooks/qs-sign";
import { useUserId } from "../../hooks/useUserId";
import {
  connectRoom,
  createRoom,
  joinRoom,
  leaveRoom,
  startGame,
} from "../../sockets/game";
import { client } from "../../sockets/receiver";

const MessengerLobby = ({ id }) => {
  const {
    notAdd,
    itAgain,
    appearance,
    haveHash,
    connectType,
    playerLobbyList,
    playersId,
    joinCode,
    gameInfo,
    user,
    notUserRoom,
  } = useStore($main);
  const userId = useUserId();
  const [complexity, setComplexity] = useState("easy");

  var clickTime = 0;

  client.gameStarted = ({ answers, task, id }) => {
    setTaskInfo(task);
    setAnswersInfo(answers);
    async function lol() {
      setGameInfo({ ...gameInfo, taskId: id });
    }
    lol();
    setNotUserRoom(false);
    setActivePanel(PanelRoute.MultiplayerGame);
  };

  client.roomCreated = ({ roomId }) => {
    joinRoom(roomId, userId);
    setJoinCode(roomId);
    setNotUserRoom(false);
  };

  useEffect(() => {
    console.log(window.location.href);

    axios
      .get(`https://showtime.app-dich.com/api/plus-plus/user-games${qsSign}`)
      .then(async function (response) {
        console.log(response.data.data[0]);
        console.log(response.data.data[0].roomId);
        console.log(window.location.hash.slice(1));
        if (response.data.data[0].ownerId === useUserId) {
          if (response.data.data[0].started) {
            setActivePanel(PanelRoute.Menu);
            setActiveStory(StoryRoute.Single);
            setGameExists(true);
          }
        }
        if (response.data.data[0].roomId === window.location.hash.slice(1)) {
          console.log("asf");
          if (response.data.data[0].started) {
            setActivePanel(PanelRoute.Menu);
            setActiveStory(StoryRoute.Single);
            setGameExists(true);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    if (notAdd === false) {
      window.history.pushState({ activePanel: "mp" }, "mp");
    }

    if (haveHash) {
      axios
        .post(`https://showtime.app-dich.com/api/plus-plus/room${qsSign}`)
        .then(async function (response) {
          setJoinCode(response.data.data);

          setGameInfo({ ...gameInfo, roomId: response.data.data });
          if (window.location.hash.slice(1) === response.data.data) {
            setConnectType("host");
            setJoinCode(window.location.hash.slice(1));
            connectRoom(qsSign, window.location.hash.slice(1), userId);
          } else {
            setJoinCode(window.location.hash.slice(1));
            connectRoom(qsSign, window.location.hash.slice(1), userId);
            setNotUserRoom(true);
          }

          setFirstStart(false);
        })
        .catch(function (error) {});
    } else if (itAgain) {
      setGameInfo({ ...gameInfo, roomId: joinCode });
    } else {
      joinToYourRoom();
    }
  }, []);

  client.gameStarted = ({ answers, task, id }) => {
    setTaskInfo(task);
    setAnswersInfo(answers);
    async function lol() {
      await setGameInfo({ taskId: id, roomId: joinCode });
    }
    lol();
    setActivePanel(PanelRoute.MultiplayerGame);
  };

  useEffect(() => {
    if (connectType === "join" && playerLobbyList.length === 1 && notUserRoom) {
      setActivePopout(PopoutRoute.AlertLobbyNotExist);
    }
  }, [playerLobbyList]);

  return (
    <Panel id={id}>
      {connectType === "join" && (
        <PanelHeader
          style={{ backgroundColor: "transparent" }}
          transparent={true}
          shadow={false}
          separator={false}
        ></PanelHeader>
      )}

      {connectType === "host" && (
        <PanelHeader
          style={{ backgroundColor: "transparent" }}
          transparent={true}
          shadow={false}
          separator={false}
        ></PanelHeader>
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
              onMouseDown={() => {
                clickTime = Date.now();
              }}
              onMouseUp={() => {
                if (Date.now() - clickTime > 499) {
                  navigator.clipboard
                    .writeText(joinCode)
                    .then(() => {
                      alert(`Copied!`);
                    })
                    .catch((error) => {});
                }
              }}
            >
              {joinCode}
            </Title>

            {connectType === "host" && (
              <Icon20Sync
                className="multiplayer-title-return"
                fill="#1A84FF"
                onClick={async function () {
                  await createRoom(joinCode);
                }}
                style={{
                  display: "inline-block",
                  paddingLeft: 5,
                  verticalAlign: "middle",
                }}
              />
            )}
          </div>
          {window.location.href.includes("m.vk.com/") ? (
            <div className="multiplayer-qr-button-div">
              <Button
                className="multiplayer-qr-button"
                style={{
                  backgroundColor:
                    appearance === "dark" ? "#293950" : "#F4F9FF",
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
          ) : (
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
                      if (error.type === "access_denied ") {
                        setActivePopout(PopoutRoute.AlertShareGame);
                      }
                    });
                }}
                before={<Icon20MessageOutline width={22} height={22} />}
                mode="secondary"
              >
                Пригласить чат
              </Button>
              <Button
                className="multiplayer-qr-button-messenger"
                style={{
                  backgroundColor:
                    appearance === "dark" ? "#293950" : "#F4F9FF",
                  color: "#1984FF",
                  marginLeft: 8,
                }}
                onClick={() => {
                  setActiveModal(ModalRoute.InputCodeQR);
                }}
                before={<Icon20QrCodeOutline />}
                mode="secondary"
              >
                QR
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

        <List style={{ marginTop: 16, marginBottom: 16 }}>
          {user &&
            [0, 1, 2, 3].map((item, index) => (
              <Cell
                key={index}
                before={
                  playerLobbyList[index] ? (
                    <Avatar src={playerLobbyList[index].avatar} />
                  ) : (
                    <div
                      style={{
                        borderColor:
                          appearance === "light" ? "#E3E3E6" : "#38383B",
                      }}
                      className="noneUser"
                    />
                  )
                }
                disabled={
                  index === 0
                    ? true
                    : false || playerLobbyList[index]
                    ? false
                    : true
                }
              >
                {playerLobbyList[index] ? (
                  <Title level="3" weight="2" className="player-name-on">
                    {playerLobbyList[index].name}
                  </Title>
                ) : (
                  <Title level="3" weight="3" className="player-name-off">
                    Пусто
                  </Title>
                )}
              </Cell>
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
                background: connectType === "host" ? "#1A84FF" : "#EBF1FA",
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
                  joinToYourRoom();
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

export default MessengerLobby;
