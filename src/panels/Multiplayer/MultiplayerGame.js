import { useEffect, useState } from "react";

import { Button, Div, Title, usePlatform } from "@vkontakte/vkui";

import "../Game/Game.css";

import { getPadTime } from "../../scripts/getPadTime";
import { answerTask } from "../../sockets/game";
import { client } from "../../sockets/receiver";

import { back, setActivePanel, setActivePopout } from "@blumjs/router";
import { useStore } from "effector-react";
import { CustomPanel } from "../../atoms/CustomPanel";
import { GamePanelHeader } from "../../atoms/GamePanelHeader";
import { PanelRoute, PopoutRoute } from "../../constants/router";
import {
  $main,
  setAnswersInfo,
  setGameInfo,
  setMpGameResults,
  setTaskInfo,
} from "../../core/main";
import { ReactComponent as RedClockIcon } from "../../img/ClockRed.svg";
import { ReactComponent as ClockIcon } from "../../img/Сlock.svg";

export const MultiplayerGame = ({ id }) => {
  const { gameInfo, taskInfo, answersInfo, appearance } = useStore($main);
  const platform = usePlatform();
  //const [equation, setEquation] = useState([2, 2, '+', 4]); //задача

  const [timeLeft, setTimeLeft] = useState(30); //время
  const [isCounting, setIsCounting] = useState(true); //время

  const minutes = getPadTime(Math.floor(timeLeft / 60)); //минуты

  const seconds = getPadTime(timeLeft - minutes * 60); //секунды

  client.gameFinished = ({ game }) => {
    console.log("game finished", game);
    setGameInfo(null);
    setMpGameResults(game);
  };

  useEffect(() => {
    timeLeft === 0
      ? setActivePanel(PanelRoute.MultiplayerResult)
      : console.log();
  }, [timeLeft]);

  useEffect(() => {
    const interval = setInterval(() => {
      isCounting &&
        setTimeLeft((timeLeft) => (timeLeft >= 1 ? timeLeft - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isCounting]);

  //код времени не мой кст :)

  client.nextTask = ({ answers, task, id }) => {
    async function newTask() {
      await setGameInfo({ ...gameInfo, taskId: id });
      await setAnswersInfo(answers);
      await setTaskInfo(task);
      back();
    }
    newTask();
  };

  return (
    <CustomPanel id={id}>
      <GamePanelHeader />

      <div className="game-div-margin">
        <Title
          level="2"
          className="selectAnswer"
          style={{ textAlign: "center" }}
        >
          Выбери правильный ответ:
        </Title>
        <div className="equationDiv">
          {taskInfo && (
            <div className="temporaryGame--inDiv">
              <span
                level="1"
                style={{
                  background: appearance === "light" ? "#F0F1F5" : "#2E2E33",
                }}
                className="equation"
              >
                {taskInfo[0]}
                {taskInfo[2]}
                {taskInfo[1]}=<span className="equationMark">?</span>
              </span>
            </div>
          )}
        </div>

        <div style={{ height: 30, marginTop: 12 }} className="single-clock-div">
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
          {answersInfo &&
            answersInfo.map((value, index) => {
              return (
                <Button
                  stretched
                  size="l"
                  sizeY="regular"
                  mode="neutral"
                  className="item"
                  id={"button" + index}
                  key={index}
                  style={{
                    background: appearance === "light" ? "#FFFFFF" : "#2E2E33",
                    color: appearance === "light" ? "#000" : "#F0F1F5",
                  }}
                  onPointerDown={(e) => {}}
                  onClick={() => {
                    //ExmpleGeneration(value, setCount, setAnswer, setEquation, equation, count)
                    async function callNextTask() {
                      if (gameInfo) {
                        await answerTask(
                          gameInfo.roomId,
                          value,
                          gameInfo.taskId
                        );
                        setActivePopout(PopoutRoute.Loading);
                      }
                    }
                    callNextTask();
                    //setIsCounting(true)
                  }}
                >
                  <Title>{answersInfo[index]}</Title>
                </Button>
              );
            })}
        </Div>
      </div>
    </CustomPanel>
  );
};
