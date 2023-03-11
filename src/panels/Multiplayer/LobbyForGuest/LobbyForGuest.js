import { useEffect } from "react";

import { Button, ButtonGroup, Div, List, Title } from "@vkontakte/vkui";

import { Icon20QrCodeOutline } from "@vkontakte/icons";
import "../Multiplayer.css";

import { setActiveModal, setActivePanel } from "@blumjs/router";
import axios from "axios";
import { useStore } from "effector-react";
import { CustomPanel } from "../../../atoms/CustomPanel";
import { UserCell } from "../../../atoms/UserCell";
import { ModalRoute, PanelRoute } from "../../../constants/router";
import {
  $main,
  setAnswersInfo,
  setFirstStart,
  setGameInfo,
  setJoinCode,
  setTaskInfo,
} from "../../../core/main";
import { qsSign } from "../../../hooks/qs-sign";
import { client } from "../../../sockets/receiver";

const LobbyForGuest = ({ id }) => {
  const { user, gameInfo, joinCode, playerLobbyList } = useStore($main);
  client.gameStarted = ({ answers, task, id }) => {
    console.debug("gameStarted", answers, task, id);
    setTaskInfo(task);
    setAnswersInfo(answers);
    setGameInfo({ ...gameInfo, taskId: id });
    setActivePanel(PanelRoute.MultiplayerGame);
  };

  useEffect(() => {
    axios
      .post(`https://showtime.app-dich.com/api/plus-plus/room${qsSign}`)
      .then(async function (response) {
        console.log(response.data.data, "lobby guests");
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
    <CustomPanel id={id}>
      <Div className="multiplayer-div">
        <div style={{ paddingLeft: "auto", paddingRight: "auto" }}>
          <Title className="multiplayer-title" style={{ textAlign: "center" }}>
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
                setActiveModal(ModalRoute.InputCodeQR);
              }}
              before={<Icon20QrCodeOutline />}
              mode="secondary"
            >
              Поделиться QR
            </Button>
          </div>
        </div>

        <List style={{ marginTop: 16, marginBottom: 16 }}>
          {user &&
            [0, 1, 2, 3].map((index) => (
              <UserCell
                name={
                  playerLobbyList[index]
                    ? playerLobbyList[index].name
                    : undefined
                }
                avatar={
                  playerLobbyList[index]
                    ? playerLobbyList[index].avatar
                    : undefined
                }
                key={index}
              />
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
    </CustomPanel>
  );
};

export default LobbyForGuest;
