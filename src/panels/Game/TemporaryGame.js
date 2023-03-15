import { useEffect, useState } from "react";

import { Button, Div, Title } from "@vkontakte/vkui";

import "./Game.css";

import axios from "axios";
import { qsSign } from "../../hooks/qs-sign";
import { getPadTime } from "../../scripts/getPadTime";

import { ReactComponent as RedClockIcon } from "../../img/ClockRed.svg";
import { ReactComponent as ClockIcon } from "../../img/Сlock.svg";

import { back, setActivePopout, useRouter } from "@blumjs/router";
import { useStore } from "effector-react";
import { CustomPanel } from "../../atoms/CustomPanel";
import { GamePanelHeader } from "../../atoms/GamePanelHeader";
import { PanelRoute, PopoutRoute } from "../../constants/router";
import { $main, setAnswer } from "../../core/main";
import { useGameButtonDelay } from "../../hooks/useDebouncing";
import { useGameFinish } from "../../hooks/useGameFinish";
import "../../img/Fonts.css";

const TemporaryGame = ({ id }) => {
  const { activePopout } = useRouter();
  const { answer, appearance } = useStore($main);
  const [first, setFirst] = useState(true); //первый запуск

  const [gameData, setGameData] = useState(false);

  const [taskNumber, setTaskNumber] = useState(0);

  const [timeLeft, setTimeLeft] = useState(30); //время
  const [isCounting, setIsCounting] = useState(false); //время

  const minutes = getPadTime(Math.floor(timeLeft / 60)); //минуты

  const seconds = getPadTime(timeLeft - minutes * 60); //секунды

  useGameFinish(timeLeft, PanelRoute.Result);

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
        setAnswer({
          id: response.data.data.id,
          lvlType: "single30",
          answers: [],
        });

        setGameData(response.data.data);
        back();
      })
      .catch(function (error) {
        back({
          afterBackHandledCallback: () => {
            setIsCounting(false);
            setActivePopout(PopoutRoute.AlertError);
          },
        });
        console.log("create err", error);
      })
      .finally(() => {
        if (first) {
          setFirst(false);
          setIsCounting(true);
        }
      });
  }

  const { isLoading, setLoading } = useGameButtonDelay();

  return (
    <CustomPanel id={id}>
      <GamePanelHeader />
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
                disabled={!!activePopout || timeLeft === 0 || isLoading}
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
                  setLoading(true);
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
    </CustomPanel>
  );
};

export default TemporaryGame;
