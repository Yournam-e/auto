import React, { useState } from "react";

import {
  Button,
  Div,
  ModalPage,
  ModalPageHeader,
  usePlatform,
} from "@vkontakte/vkui";

import bridge from "@vkontakte/vk-bridge";

import { Icon24DismissDark } from "@vkontakte/icons";

import "./style.css";

import axios from "axios";

import { back, setActivePopout } from "@blumjs/router";
import { useStore } from "effector-react";
import { PopoutRoute } from "../../../../constants/router";
import {
  $main,
  setConnectType,
  setGameInfo,
  setJoinCode,
} from "../../../../core/main";
import { qsSign } from "../../../../hooks/qs-sign";
import { joinRoom } from "../../../../sockets/game";
import InputMinimalist from "./InputMinimalist";

export const ModalInputCode = ({ id }) => {
  const { gameInfo, joinCode } = useStore($main);
  const platform = usePlatform();
  const textInput = React.createRef();

  const [disabledButton, setDisabledButton] = useState(true);

  async function getId() {
    axios
      .get(
        `https://showtime.app-dich.com/api/plus-plus/room/exists/${textInput.current.state.value}${qsSign}`
      ) //получил инфу о лвлах
      .then(async function (res) {
        await console.log(res.data.data);
        if (res.data.data === true) {
          const user = await bridge.send("VKWebAppGetUserInfo");
          //await connectRoom(qsSign, textInput.current.value, user.id);
          joinRoom(textInput.current.state.value, user.id);
          setGameInfo({ ...gameInfo, roomId: textInput.current.state.value });
          setConnectType("join");
          setJoinCode(textInput.current.state.value);
          back();
        } else {
          setActivePopout(PopoutRoute.AlertLobby);
        }
      })
      .catch(function (error) {
        console.warn(error);
      });
  }

  return (
    <ModalPage id={id}>
      <ModalPageHeader
        after={
          platform === "ios" ||
          platform === "android" ||
          (platform === "mobile-web" && <Icon24DismissDark onClick={back} />)
        }
      >
        Введите код
      </ModalPageHeader>
      <Div>
        <Div style={{ padding: 10 }}></Div>

        <div className="input-code-div">
          <InputMinimalist
            placeholder="XXXXXX"
            ref={textInput}
            maxLength={6}
            onChange={(value) => {
              if (value === joinCode || value.length < 6) {
                setDisabledButton(true);
              } else {
                setDisabledButton(false);
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                getId();
              }
            }}
          />
        </div>

        <div></div>

        <Div style={{ marginLeft: 20, marginTop: 30, marginRight: 20 }}>
          <Button
            stretched
            disabled={disabledButton}
            onClick={() => {
              getId();
              console.log();
            }}
            style={{ padding: 12, borderRadius: 100, background: "1A84FF" }}
          >
            Присоединиться
          </Button>
        </Div>
      </Div>
      <Div style={{ padding: 20 }}></Div>
    </ModalPage>
  );
};
