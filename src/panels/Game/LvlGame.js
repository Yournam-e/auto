import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Div,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  ScreenSpinner,
  Title,
} from "@vkontakte/vkui";

import "./Game.css";

import decideTask from "../../scripts/decideTask";

import { Icon24Back, Icon24ChevronLeft } from "@vkontakte/icons";
import axios from "axios";
import { qsSign } from "../../hooks/qs-sign";
import { getPadTime } from "../../scripts/getPadTime";

import { ReactComponent as ClockIcon } from "../../img/Сlock.svg";

import { ReactComponent as RedClockIcon } from "../../img/ClockRed.svg";
const LvlGame = ({
  id,
  go,
  count,
  setCount,
  setActivePanel,
  setPopout,
  lvlNumber,
  ready,
  setLvlResult,
  lvlResult,
  setTimeFinish,
  themeColors,
  setAllTasks,
  allTasks,
  platform,
}) => {
  const [lvlData, setLvlData] = useState(false);

  const [equation, setEquation] = useState([2, 2, "+", 4]); //задача

  const [answer, setAnswer] = useState([3, 1, 2, 4]); //варианты ответов

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
        setPopout(null);
      })
      .catch(function (error) {});
  }

  useEffect(() => {
    function pastTime() {
      setTimeFinish(Date.now());
      setActivePanel("resultLvl");
    }
    timeLeft === 0 ? pastTime() : console.log();
  }, [timeLeft]);

  useEffect(() => {
    if (ready === true) {
      createLvl();
    }
  }, [ready]);

  useEffect(() => {
    //createLvl()
    async function lol() {
      await setPopout(<ScreenSpinner size="large" />);
      setPopout(null);
    }

    window.history.pushState({ activePanel: "lvlGame" }, "lvlGame");

    lol();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      isCounting &&
        setTimeLeft((timeLeft) => (timeLeft >= 1 ? timeLeft - 1 : 0));
    }, 1000);
  }, [isCounting]);
  //код времени не мой кст :)

  useEffect(() => {}, [taskNumber]);

  useEffect(() => {}, [allTasks]);

  return (
    <Panel id={id}>
      <div
        style={{
          background: themeColors === "light" ? "#F7F7FA" : "#1D1D20",
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
                setPopout(
                  <Alert
                    actions={[
                      {
                        title: "Завершить",
                        mode: "destructive",
                        autoclose: true,
                        action: () =>
                          setActivePanel("menu") && setAllTasks([{}]),
                      },
                      {
                        title: "Отмена",
                        autoclose: true,
                        mode: "cancel",
                      },
                    ]}
                    actionsLayout="vertical"
                    onClose={() => {
                      setPopout(null);
                    }}
                    header="Подтвердите действие"
                    text="Вы уверены, что хотите завершить игру?"
                  />
                );
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
            {(!lvlData && "Выбери любой ответ, чтобы начать") ||
              (lvlData && "Выбери правильный ответ:")}
          </Title>
          <div className="equationDiv">
            <div className="temporaryGame--inDiv">
              <span
                level="1"
                className="equation"
                style={{
                  background: themeColors === "light" ? "#F0F1F5" : "#2E2E33",
                }}
              >
                {lvlData && lvlData.tasks[taskNumber].task[0]}
                {lvlData && lvlData.tasks[taskNumber].task[2]}
                {lvlData && lvlData.tasks[taskNumber].task[1]}
                {!lvlData && "1+2"}=<span className="equationMark">?</span>
              </span>
            </div>
          </div>

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
                  key={index}
                  style={{
                    background: themeColors === "light" ? "#FFFFFF" : "#2E2E33",
                    color: themeColors === "light" ? "#000" : "#F0F1F5",
                  }}
                  onPointerDown={(e) => {}}
                  onClick={() => {
                    //ExmpleGeneration(value, setCount, setAnswer, setEquation, equation, count)
                    if (first === true) {
                      setFirst(false);
                      createLvl();
                    } else {
                      if (lvlData) {
                        if (lvlData.tasks.length - 1 === taskNumber) {
                          //eсли последняя задача

                          async function finished() {
                            await setTimeFinish(Date.now());

                            const checkRight = await decideTask(
                              taskNumber,
                              lvlData.tasks[taskNumber].task[0],
                              lvlData.tasks[taskNumber].task[1],
                              lvlData.tasks[taskNumber].task[2],
                              lvlData.tasks[taskNumber].answers[index]
                            );

                            await setAllTasks([
                              ...allTasks,
                              {
                                id: lvlData.tasks[taskNumber].id,
                                answer:
                                  lvlData.tasks[taskNumber].answers[index],
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
                            await setLvlResult(copy);

                            await setPopout(<ScreenSpinner size="large" />);
                            await setActivePanel("resultLvl");
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

                    setIsCounting(true);
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
      </div>
    </Panel>
  );
};

export default LvlGame;
