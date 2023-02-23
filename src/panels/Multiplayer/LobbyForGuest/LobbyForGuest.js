import { useEffect } from "react";

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

import { Icon20QrCodeOutline } from "@vkontakte/icons";
import "../Multiplayer.css";

import axios from "axios";
import { qsSign } from "../../../hooks/qs-sign";
import { useUserId } from "../../../hooks/useUserId";
import { client } from "../../../sockets/receiver";

const LobbyForGuest = ({
  id,
  fetchedUser,
  setActiveModal,
  setGameInfo,
  gameInfo,
  joinCode,
  setJoinCode,
  firstStart,
  setFirstStart,
  playersList,
  setTaskInfo,
  setAnswersInfo,
  setActivePanel,
  themeColors,
}) => {
  const userId = useUserId();

  client.gameStarted = ({ answers, task, id }) => {
    console.debug("gameStarted", answers, task, id);
    setTaskInfo(task);
    setAnswersInfo(answers);
    async function lol() {
      setGameInfo({ ...gameInfo, taskId: id });
    }
    lol();
    setActivePanel("multiplayerGame");
  };

  useEffect(() => {
    axios
      .post(`https://showtime.app-dich.com/api/plus-plus/room${qsSign}`)
      .then(async function (response) {
        console.log(response.data.data);
        await setJoinCode(response.data.data);

        console.log("12");
        await setGameInfo({ ...gameInfo, roomId: response.data.data });
        setFirstStart(false);
      })
      .catch(function (error) {
        console.warn(error);
      });
  }, []);

  return (
    <Panel id={id}>
      <div
        style={{
          background: themeColors === "light" ? "#F7F7FA" : "#1D1D20",
          height: window.pageYOffset,
        }}
      >
        <Div className="multiplayer-div">
          <div style={{ paddingLeft: "auto", paddingRight: "auto" }}>
            <Title
              className="multiplayer-title"
              style={{ textAlign: "center" }}
            >
              Лобби друга
            </Title>

            <div style={{ height: 30 }} className="multiplayer-title-div">
              <Title
                className="multiplayer-title-code"
                style={{
                  display: "inline-block",
                  paddingLeft: 5,
                }}
              >
                {joinCode}
              </Title>
            </div>
            <div className="multiplayer-qr-button-div">
              <Button
                className="multiplayer-qr-button"
                style={{ backgroundColor: "#ECF1FA" }}
                onClick={() => {
                  setActiveModal("inputCodeQR");
                }}
                before={<Icon20QrCodeOutline />}
                mode="secondary"
              >
                Поделиться QR
              </Button>
            </div>
          </div>

          <List style={{ marginTop: 16, marginBottom: 16 }}>
            {fetchedUser &&
              [0, 1, 2, 3].map((item, index) => (
                <Cell
                  key={index}
                  mode={
                    index === 0
                      ? false
                      : "removable" || playersList[index]
                      ? false
                      : "removable"
                  }
                  before={
                    playersList[index] ? (
                      <Avatar src={playersList[index].avatar} />
                    ) : (
                      <div className="ory" />
                    )
                  }
                  disabled={
                    index === 0
                      ? true
                      : false || playersList[index]
                      ? false
                      : true
                  }
                >
                  {playersList[index] ? (
                    <Title level="3" weight="2" className="player-name-on">
                      {playersList[index].name}
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
            <ButtonGroup
              gap="space"
              style={{ marginTop: 10 }}
              className="multiplayer-play-div"
            >
              <Button
                size="s"
                className="multiplayer-play-button"
                appearance="accent"
                disabled={true}
                loading={true}
              >
                Играть
              </Button>
            </ButtonGroup>
          </div>
        </Div>
      </div>
    </Panel>
  );
};

export default LobbyForGuest;
