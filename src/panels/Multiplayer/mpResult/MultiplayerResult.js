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

import { Icon16Done, Icon16Spinner } from "@vkontakte/icons";
import { createRoom, joinRoom, leaveRoom } from "../../../sockets/game";
import { client } from "../../../sockets/receiver";
import "../../Game/Game.css";

const MultiplayerResult = ({
  id,
  go,
  mpGameResults,
  fetchedUser,
  setActivePanel,
  joinCode,
  playersList,
  themeColors,
  setAgain,
  connectType,
  setJoinCode,
  setActiveStory,
  setConnectType,
  setPlayersId,
  setHaveHash,
}) => {
  //let friendList = null
  const [friendList, setFriendList] = useState(null);

  const [readyToReplay, setReadyToReplay] = useState(false);

  const [place, setPlace] = useState(5);

  const [timeLeft, setTimeLeft] = useState(10); //время
  const [isCounting, setIsCounting] = useState(true); //время

  const [buttonTitle, setButtonTitle] = useState("");

  const [newA, setNewA] = useState([]);

  let lasd = playersList;

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
    if (newA.length === 0 && playersList && playersList !== null) {
      setNewA(playersList);
    }
  }, [playersList]);

  useEffect(() => {
    const interval = setInterval(() => {
      isCounting &&
        setTimeLeft((timeLeft) => (timeLeft >= 1 ? timeLeft - 1 : 0));
    }, 1000);
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
    if (mpGameResults) {
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
      if (item.userId === fetchedUser.id) {
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
        await setActiveStory("multiplayer");
        await setJoinCode(roomId);
        await setActivePanel("menu");
      }

      onRoomCreate();
    };
  }

  return (
    <Panel id={id} className="resultPagePanel">
      <div
        style={{
          background: themeColors === "light" ? "#F7F7FA" : "#1D1D20",
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
            {mpGameResults && fetchedUser && (
              <Title className="result-task-text">
                Набрано баллов:{" "}
                {mpGameResults.players.map((value) => {
                  if (value.userId === fetchedUser.id) {
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
                                    themeColors === "dark"
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
                    leaveRoom(joinCode, fetchedUser.id);
                    setAgain(false);
                    setActiveStory("multiplayer");
                    setConnectType("host");
                    setHaveHash(false);
                    go(e);
                  }}
                  data-to="menu"
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
