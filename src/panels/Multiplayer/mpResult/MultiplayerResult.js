import { useEffect, useState } from "react";

import {
  Avatar,
  Button,
  ButtonGroup,
  Cell,
  Div,
  List,
  Panel,
  Title,
} from "@vkontakte/vkui";

import { setActivePanel } from "@blumjs/router";
import { Icon16Done, Icon16Spinner } from "@vkontakte/icons";
import { useStore } from "effector-react";
import { PanelRoute, StoryRoute } from "../../../constants/router";
import {
  $main,
  setActiveStory,
  setAgain,
  setConnectType,
  setHaveHash,
  setJoinCode,
  setPlayersId,
} from "../../../core/main";
import { createRoom, joinRoom, leaveRoom } from "../../../sockets/game";
import { client } from "../../../sockets/receiver";
import "../../Game/Game.css";

const MultiplayerResult = ({ id }) => {
  const {
    joinCode,
    appearance,
    playerLobbyList,
    user,
    mpGameResults,
    connectType,
  } = useStore($main);
  const [friendList, setFriendList] = useState([]);

  const [readyToReplay, setReadyToReplay] = useState(false);

  const [place, setPlace] = useState(5);

  const [timeLeft, setTimeLeft] = useState(10); //время
  const [isCounting, setIsCounting] = useState(true); //время

  const [buttonTitle, setButtonTitle] = useState("");

  const [newA, setNewA] = useState([]);

  useEffect(() => {
    if (timeLeft === 0) {
      if (connectType === "host") {
        if (readyToReplay) {
          setReadyToReplay(true);
          setPlayersId([]);
          createRoom(joinCode);
        }
      }
    }
  }, [timeLeft]);

  useEffect(() => {
    if (newA.length === 0 && playerLobbyList && playerLobbyList !== null) {
      setNewA(playerLobbyList);
    }
  }, [playerLobbyList]);

  useEffect(() => {
    const interval = setInterval(() => {
      isCounting &&
        setTimeLeft((timeLeft) => (timeLeft >= 1 ? timeLeft - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isCounting]);

  useEffect(() => {
    if (timeLeft === 0) {
      if (readyToReplay) {
        setTimeout(() => {
          setButtonTitle("Лобби закрыто");
        }, 2000);
      } else {
        setButtonTitle("Время вышло");
      }
    }
  }, [timeLeft]);

  useEffect(() => {
    if (mpGameResults && mpGameResults.players) {
      const newArr = mpGameResults.players.sort((a, b) =>
        a.rightResults > b.rightResults ? -1 : 1
      );
      setFriendList(newArr);
    }
  }, [mpGameResults]);

  useEffect(() => {
    if (friendList) {
      devideArray();
    }

    console.log(friendList);
  }, [friendList]);

  function countPosition(rights, index) {
    if (index !== 0) {
      for (var i = 0; ; i++) {
        if (i === index) {
          return index;
        } else {
          if (friendList[i].rightResults === rights) {
            return i;
          }
        }
      }
    } else {
      return 0;
    }
  }

  function devideArray() {
    friendList.map((item, index) => {
      if (item.userId === user.id) {
        if (index !== 0) {
          friendList[index - 1].rightResults > item.rightResults
            ? setPlace(index)
            : setPlace(index - 1);
        } else {
          setPlace(index);
        }
      }
    });
  }

  if (readyToReplay) {
    client.roomCreated = ({ roomId }) => {
      async function onRoomCreate() {
        await setHaveHash(false);
        await setAgain(true);
        await joinRoom(roomId);
        await setActiveStory(StoryRoute.Multiplayer);
        await setJoinCode(roomId);
        await setActivePanel(PanelRoute.Menu);
      }

      onRoomCreate();
    };
  }

  return (
    <Panel id={id} className="resultPagePanel">
      <div
        style={{
          background: appearance === "light" ? "#F7F7FA" : "#1D1D20",
          height: window.pageYOffset,
        }}
      >
        <Div className="check-circle-outline">
          <div
            style={{ marginLeft: "auto", marginRight: "auto", marginTop: 16 }}
          >
            <Title className="result-task-title">
              Вы заняли
              <span
                style={{ color: "#2BD328", paddingRight: 5, paddingLeft: 5 }}
              >
                {mpGameResults && place + 1}-e место!
              </span>
            </Title>
          </div>

          <div style={{ marginLeft: 18, marginRight: 18, marginTop: 16 }}>
            {mpGameResults && user && (
              <Title className="result-task-text">
                Набрано баллов:{" "}
                {mpGameResults.players &&
                  mpGameResults.players.map((value) => {
                    if (value.userId === user.id) {
                      return value.rightResults;
                    }
                  })}
              </Title>
            )}
          </div>

          <List className="result-friendList" style={{ marginTop: 20 }}>
            {friendList &&
              friendList.map((item, idx) => (
                <div style={{ height: 65, marginLeft: 16, marginTop: 25 }}>
                  {mpGameResults &&
                    newA &&
                    newA.map((inItem, index) => {
                      if (item.userId === inItem.userId) {
                        return (
                          <Cell
                            style={{ marginLeft: 5, marginRight: 5 }}
                            key={idx}
                            before={
                              <div style={{ width: 100 }}>
                                <Avatar
                                  size={56}
                                  className="friendsAvatar"
                                  src={inItem.avatar}
                                />
                                <Title
                                  style={{ verticalAlign: "middle" }}
                                  className="result-friend-position"
                                >
                                  #{countPosition(item.rightResults, idx) + 1}
                                </Title>
                              </div>
                            }
                          >
                            <div key={inItem}>
                              <Title
                                level="3"
                                style={{ paddingBottom: 8, marginLeft: 10 }}
                              >
                                {inItem.name}
                              </Title>
                              <Button
                                className="friendsPoint"
                                before={<Icon16Done />}
                                hasActive={false}
                                hasHover={false}
                                style={{
                                  backgroundColor:
                                    appearance === "dark"
                                      ? "#293950"
                                      : "#F4F9FF",
                                  color: "#1984FF",
                                  borderRadius: 25,
                                  marginLeft: 10,
                                }}
                              >
                                <p style={{ textAlign: "center" }}>
                                  {item.rightResults}
                                </p>
                              </Button>
                            </div>
                          </Cell>
                        );
                      }
                    })}
                </div>
              ))}
          </List>

          <div className="result-absolute-div">
            <ButtonGroup className="result-buttonGroup" mode="vertical" gap="m">
              <div className="result-buttonRetry-div">
                <Button
                  size="l"
                  onClick={() => {
                    setReadyToReplay(true);
                  }}
                  before={
                    readyToReplay ? (
                      timeLeft ? (
                        <div className="loaderIcon">
                          <Icon16Spinner />
                        </div>
                      ) : (
                        false
                      )
                    ) : (
                      false
                    )
                  }
                  disabled={timeLeft ? (readyToReplay ? true : false) : true}
                  style={{
                    backgroundColor: "#1A84FF",
                    borderRadius: 100,
                  }}
                  className="result-buttonGroup-retry"
                  appearance="accent"
                  stretched
                >
                  {timeLeft
                    ? readyToReplay
                      ? timeLeft + " сек до начала..."
                      : "Сыграть снова " + timeLeft + " сек"
                    : buttonTitle}
                </Button>
              </div>
              <div
                className="result-buttonNotNow-div"
                style={{ paddingBottom: 21 }}
              >
                <Button
                  className="result-buttonGroup-notNow"
                  onClick={(e) => {
                    //joinToYourRoom()
                    leaveRoom(joinCode, user.id);
                    setAgain(false);
                    setActiveStory(StoryRoute.Multiplayer);
                    setConnectType("host");
                    setHaveHash(false);
                    setActivePanel(PanelRoute.Menu);
                  }}
                  size="l"
                  style={{
                    borderRadius: 25,
                    color: "#1A84FF",
                  }}
                  appearance="accent"
                  mode="tertiary"
                  stretched
                >
                  В меню
                </Button>
              </div>
            </ButtonGroup>
          </div>
        </Div>
      </div>
    </Panel>
  );
};

export default MultiplayerResult;
