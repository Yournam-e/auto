import { useEffect, useState } from "react";

import { Button, Div, Title } from "@vkontakte/vkui";

import "./Game.css";

import decideTask from "../../scripts/decideTask";

import {
  back,
  setActivePanel,
  setActivePopout,
  useRouter,
} from "@blumjs/router";
import axios from "axios";
import { qsSign } from "../../hooks/qs-sign";
import { getPadTime } from "../../scripts/getPadTime";

import { ReactComponent as ClockIcon } from "../../img/Сlock.svg";

import { useStore } from "effector-react";
import { CustomPanel } from "../../atoms/CustomPanel";
import { GamePanelHeader } from "../../atoms/GamePanelHeader";
import { PanelRoute, PopoutRoute } from "../../constants/router";
import {
  $main,
  setAllTasks,
  setLvlResult,
  setTimeFinish,
} from "../../core/main";
import { useGameButtonDelay } from "../../hooks/useDebouncing";
import { useGameFinish } from "../../hooks/useGameFinish";
import { ReactComponent as RedClockIcon } from "../../img/ClockRed.svg";

const LvlGame = ({ id }) => {
  const { activePopout } = useRouter();
  const { lvlNumber, lvlResult, allTasks, appearance } = useStore($main);
  const [lvlData, setLvlData] = useState(false);

  const [taskNumber, setTaskNumber] = useState(0);

  const [first, setFirst] = useState(true);

  const [timeLeft, setTimeLeft] = useState(30); //время
  const [isCounting, setIsCounting] = useState(false); //начать счет?

  const minutes = getPadTime(Math.floor(timeLeft / 60)); //минуты

  const seconds = getPadTime(timeLeft - minutes * 60); //секунды

  function devideType() {
    switch (lvlNumber) {
      case 1:
        return "one";
      case 2:
        return "two";
      case 3:
        return "three";
      case 4:
        return "four";
      case 5:
        return "five";
      case 6:
        return "six";
      case 7:
        return "seven";
      case 8:
        return "eight";
      case 9:
        return "nine";
      case 10:
        return "ten";
    }
  }

  function createLvl() {
    setActivePopout(PopoutRoute.Loading);
    axios
      .post(`https://showtime.app-dich.com/api/plus-plus/lvl${qsSign}`, {
        lvlType: devideType(),
      })
      .then(async function (response) {
        setLvlData(response.data.data);
        setLvlResult({
          id: response.data.data.id,
          lvlType: devideType(),
          answers: [],
        });
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

  useGameFinish(timeLeft, PanelRoute.ResultLvl);

  useEffect(() => {
    const interval = setInterval(() => {
      isCounting &&
        setTimeLeft((timeLeft) => (timeLeft >= 1 ? timeLeft - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isCounting]);

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
          {(!lvlData && "Выбери любой ответ, чтобы начать") ||
            (lvlData && "Выбери правильный ответ:")}
        </Title>
        <div className="equationDiv">
          <div className="temporaryGame--inDiv">
            <span
              level="1"
              className="equation"
              style={{
                background: appearance === "light" ? "#F0F1F5" : "#2E2E33",
              }}
            >
              {lvlData && lvlData.tasks[taskNumber].task[0]}
              {lvlData && lvlData.tasks[taskNumber].task[2]}
              {lvlData && lvlData.tasks[taskNumber].task[1]}
              {!lvlData && "1+2"}=<span className="equationMark">?</span>
            </span>
          </div>
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
                key={index}
                style={{
                  background: appearance === "light" ? "#FFFFFF" : "#2E2E33",
                  color: appearance === "light" ? "#000" : "#F0F1F5",
                }}
                onClick={() => {
                  setLoading(true);
                  //ExmpleGeneration(value, setCount, setAnswer, setEquation, equation, count)
                  if (first) {
                    createLvl();
                  } else if (timeLeft > 0) {
                    if (lvlData) {
                      if (lvlData.tasks.length - 1 === taskNumber) {
                        //eсли последняя задача

                        async function finished() {
                          setTimeFinish(Date.now());

                          const checkRight = decideTask(
                            taskNumber,
                            lvlData.tasks[taskNumber].task[0],
                            lvlData.tasks[taskNumber].task[1],
                            lvlData.tasks[taskNumber].task[2],
                            lvlData.tasks[taskNumber].answers[index]
                          );

                          setAllTasks([
                            ...allTasks,
                            {
                              id: lvlData.tasks[taskNumber].id,
                              answer: lvlData.tasks[taskNumber].answers[index],
                              number1: `${lvlData.tasks[taskNumber].task[0]}`,
                              sign: `${lvlData.tasks[taskNumber].task[2]}`,
                              number3: `${lvlData.tasks[taskNumber].task[1]}`,
                              pcAnswer: checkRight[1],
                              complete: checkRight[0],
                            },
                          ]);

                          const newItem = {
                            id: lvlData.tasks[taskNumber].id,
                            answer: lvlData.tasks[taskNumber].answers[index],
                          };

                          const copy = Object.assign({}, lvlResult);
                          copy.answers = [...lvlResult.answers, newItem];
                          setLvlResult(copy);

                          setActivePanel(PanelRoute.ResultLvl);
                        }

                        finished();
                      } else {
                        const checkRight = decideTask(
                          taskNumber,
                          lvlData.tasks[taskNumber].task[0],
                          lvlData.tasks[taskNumber].task[1],
                          lvlData.tasks[taskNumber].task[2],
                          lvlData.tasks[taskNumber].answers[index]
                        );

                        setAllTasks([
                          ...allTasks,
                          {
                            id: lvlData.tasks[taskNumber].id,
                            answer: lvlData.tasks[taskNumber].answers[index],
                            number1: `${lvlData.tasks[taskNumber].task[0]}`,
                            sign: `${lvlData.tasks[taskNumber].task[2]}`,
                            number3: `${lvlData.tasks[taskNumber].task[1]}`,
                            pcAnswer: checkRight[1],
                            complete: checkRight[0],
                          },
                        ]);

                        setTaskNumber(taskNumber + 1);

                        const newItem = {
                          id: lvlData.tasks[taskNumber].id,
                          answer: lvlData.tasks[taskNumber].answers[index],
                        };

                        const copy = Object.assign({}, lvlResult);
                        copy.answers = [...lvlResult.answers, newItem];
                        setLvlResult(copy);
                      }
                    }
                  }
                }}
              >
                <Title>
                  {lvlData && lvlData.tasks[taskNumber].answers[index]}
                  {!lvlData && value}
                </Title>
              </Button>
            );
          })}
        </Div>
      </div>
    </CustomPanel>
  );
};

export default LvlGame;
