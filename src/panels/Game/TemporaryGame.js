import { useEffect, useState } from "react";

import {
  Button,
  Div,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Title,
  usePlatform,
} from "@vkontakte/vkui";

import "./Game.css";

import { Icon24Back, Icon24ChevronLeft } from "@vkontakte/icons";
import axios from "axios";
import { qsSign } from "../../hooks/qs-sign";
import { getPadTime } from "../../scripts/getPadTime";

import { ReactComponent as RedClockIcon } from "../../img/ClockRed.svg";
import { ReactComponent as ClockIcon } from "../../img/Сlock.svg";

import { back, setActivePanel, setActivePopout } from "@blumjs/router";
import { useStore } from "effector-react";
import { PanelRoute, PopoutRoute } from "../../constants/router";
import { $main, setAnswer } from "../../core/main";
import "../../img/Fonts.css";

const TemporaryGame = ({ id }) => {
  const { answer, appearance } = useStore($main);
  const platform = usePlatform();
  const [first, setFirst] = useState(true); //первый запуск

  const [gameData, setGameData] = useState(false);

  const [taskNumber, setTaskNumber] = useState(0);

  const [timeLeft, setTimeLeft] = useState(30); //время
  const [isCounting, setIsCounting] = useState(false); //время

  const minutes = getPadTime(Math.floor(timeLeft / 60)); //минуты

  const seconds = getPadTime(timeLeft - minutes * 60); //секунды

  useEffect(() => {
    if (timeLeft === 0) {
      setTaskNumber(0);
      setActivePanel(PanelRoute.Result);
    }
  }, [timeLeft]);

  useEffect(() => {
    setInterval(() => {
      isCounting &&
        setTimeLeft((timeLeft) => (timeLeft >= 1 ? timeLeft - 1 : 0));
    }, 1000);
  }, [isCounting]);

  function createLvl() {
    setActivePopout(PopoutRoute.Loading);
    axios
      .post(`https://showtime.app-dich.com/api/plus-plus/lvl${qsSign}`, {
        lvlType: "single30",
      })
      .then(async function (response) {
        setIsCounting(true);
        setAnswer({
          id: response.data.data.id,
          lvlType: "single30",
          answers: [],
        });

        setGameData(response.data.data);
      })
      .catch(function (error) {
        console.log("create lvl err", error);
      })
      .finally(() => {
        back();
      });
  }

  return (
    <Panel id={id}>
      <div
        style={{
          background: appearance === "light" ? "#F7F7FA" : "#1D1D20",
          height: document.documentElement.scrollHeight,
        }}
      >
        <PanelHeader
          style={{ backgroundColor: "transparent" }}
          transparent={true}
          shadow={false}
          separator={false}
          before={
            <PanelHeaderButton
              onClick={() => {
                setActivePopout(PopoutRoute.AlertFinishGame);
              }}
            >
              {platform === "ios" ? (
                <Icon24ChevronLeft width={28} height={28} fill="#1A84FF" />
              ) : (
                <Icon24Back width={28} height={28} fill="#1A84FF" />
              )}
            </PanelHeaderButton>
          }
        ></PanelHeader>

        <div className="game-div-margin">
          <Title
            level="2"
            className="selectAnswer"
            style={{ textAlign: "center" }}
          >
            {(!gameData && "Выбери любой ответ, чтобы начать") ||
              (gameData && "Выбери правильный ответ:")}
          </Title>
          <div className="equationDiv">
            {gameData && (
              <div className="temporaryGame--inDiv">
                <span
                  level="1"
                  className="equation"
                  style={{
                    background: appearance === "light" ? "#F0F1F5" : "#2E2E33",
                  }}
                >
                  {gameData.tasks[taskNumber].task[0]}
                  {gameData.tasks[taskNumber].task[2]}
                  {gameData.tasks[taskNumber].task[1]}=
                  <span className="equationMark">?</span>
                </span>
              </div>
            )}
          </div>

          {!gameData && (
            <div className="equationDiv">
              <div className="temporaryGame--inDiv">
                <span
                  level="1"
                  className="equation"
                  style={{
                    background: appearance === "light" ? "#F0F1F5" : "#2E2E33",
                  }}
                >
                  1+2 =<span className="equationMark">?</span>
                </span>
              </div>
            </div>
          )}

          <div
            style={{ height: 30, marginTop: 12 }}
            className="single-clock-div"
          >
            {seconds > 5 ? (
              <ClockIcon
                width={16}
                height={16}
                className="multiplayer-title-return"
                style={{
                  display: "inline-block",
                  paddingLeft: 5,
                  marginTop: 3,
                }}
              />
            ) : (
              <RedClockIcon
                width={16}
                height={16}
                className="multiplayer-title-return"
                style={{
                  display: "inline-block",
                  paddingLeft: 5,
                  marginTop: 3,
                }}
              />
            )}
            <Title
              className="multiplayer-title-code"
              style={{
                display: "inline-block",
                paddingLeft: 5,
                color: "#99A2AD",
                color: seconds > 5 ? "#99A2AD" : "#FF2525",
                fontSize: 14,
              }}
            >
              <span>{minutes}</span>
              <span>:</span>
              <span>{seconds}</span>
            </Title>
          </div>

          <Div className="container">
            {[0, 1, 2, 3].map((value, index) => {
              return (
                <Button
                  stretched
                  size="l"
                  sizeY="regular"
                  mode="neutral"
                  className="item"
                  id={"button" + index}
                  style={{
                    background: appearance === "light" ? "#FFFFFF" : "#2E2E33",
                    color: appearance === "light" ? "#000" : "#F0F1F5",
                  }}
                  key={index}
                  onClick={() => {
                    if (first) {
                      createLvl();
                    }

                    if (!first) {
                      if (gameData) {
                        const newItem = {
                          id: gameData.tasks[taskNumber].id,
                          answer: gameData.tasks[taskNumber].answers[index],
                        };

                        const copy = Object.assign({}, answer);
                        copy.answers = [...answer.answers, newItem];
                        setAnswer(copy);
                      }
                    }
                    setFirst(false);
                    setTaskNumber(taskNumber + 1);
                  }}
                >
                  <Title>
                    {gameData && gameData.tasks[taskNumber].answers[index]}
                    {!gameData && index + 1}
                  </Title>
                </Button>
              );
            })}
          </Div>
        </div>
      </div>
    </Panel>
  );
};

export default TemporaryGame;
