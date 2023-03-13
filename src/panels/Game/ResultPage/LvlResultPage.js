import { useEffect, useState } from "react";

import { back, setActivePanel, setActivePopout } from "@blumjs/router";
import {
  Icon20ArrowRightOutline,
  Icon24CancelOutline,
  Icon24DoneOutline,
  Icon24RefreshOutline,
  Icon56CancelCircleOutline,
  Icon56CheckCircleOutline,
  Icon56RecentOutline,
} from "@vkontakte/icons";
import { Button, ButtonGroup, Cell, List, Title } from "@vkontakte/vkui";
import axios from "axios";
import { useStore } from "effector-react";
import { CustomPanel } from "../../../atoms/CustomPanel";
import { PanelRoute, PopoutRoute } from "../../../constants/router";
import { $main, setAllTasks, setLvlNumber, setReady } from "../../../core/main";
import { qsSign } from "../../../hooks/qs-sign";
import { useResultButtonDelay } from "../../../hooks/useDebouncing";
import { ReactComponent as ClockIcon } from "../../../img/Сlock.svg";
import "./LvlResultPage.css";

const LvlResultPage = ({ id }) => {
  const { allTasks, lvlResult, lvlNumber, appearance } = useStore($main);
  const url = "https://showtime.app-dich.com/api/plus-plus/";

  const [complete, setComplete] = useState();

  const [finishedTime, setFinishedTime] = useState();

  function devideLvl(numberId) {
    switch (numberId) {
      case 1:
        return ["30 секунд", "10 задач", 10];
      case 2:
        return ["30 секунд", "10 задач", 10];
      case 3:
        return ["30 секунд", "10 задач", 10];
      case 4:
        return ["30 секунд", "15 задач", 15];
      case 5:
        return ["30 секунд", "15 задач", 15];
      case 6:
        return ["30 секунд", "15 задач", 15];
      case 7:
        return ["30 секунд", "15 задач", 15];
      case 8:
        return ["30 секунд", "15 задач", 15];
      case 9:
        return ["30 секунд", "15 задач", 15];
      case 10:
        return ["30 секунд", "20 задач", 20];
    }
  }

  function devideType(i) {
    switch (i) {
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

  function playNext() {
    const url = "https://showtime.app-dich.com/api/plus-plus/";

    axios
      .get(`${url}info${qsSign}`) //получил инфу о лвлах
      .then(async function (response) {
        const lvls = await response.data.data;

        const promise = new Promise((resolve, reject) => {
          async function deleted() {
            for await (const item of lvls) {
              if (
                item.lvlType ===
                devideType(complete[0] ? lvlNumber + 1 : lvlNumber)
              ) {
                try {
                  axios
                    .delete(
                      `https://showtime.app-dich.com/api/plus-plus/lvl/${item.id}${qsSign}`
                    )
                    .then(async function (response) {
                      setReady(true);
                      resolve();
                    })

                    .catch(function () {});
                } catch (e) {}
              }

              complete[0]
                ? setLvlNumber(lvlNumber + 1)
                : setLvlNumber(lvlNumber);

              resolve();
            }
          }

          deleted();
        });

        promise.then((result) => setActivePanel(PanelRoute.LvlGame));
      })
      .catch(function (error) {
        console.warn(error);
      });
  }

  useEffect(() => {
    setActivePopout(PopoutRoute.Loading);
    setReady(false);
    axios
      .put(`https://showtime.app-dich.com/api/plus-plus/lvl${qsSign}`, {
        id: lvlResult.id,
        lvlType: lvlResult.lvlType,
        answers: lvlResult.answers,
      })
      .then(async function (response) {
        axios
          .get(`${url}info${qsSign}`) //получил инфу о лвлах
          .then(async function (response) {
            const items = response.data.data;
            console.log(items);
            const searchTerm = lvlResult.lvlType;
            const rightResults = items.find(
              (one) => one.lvlType === searchTerm
            ).rightResults;
            const time = items.find((one) => one.lvlType === searchTerm);

            const timeMs =
              new Date(time.finished) - new Date(time.started).getTime();
            setFinishedTime(Math.min(timeMs / 1000, 30));
            console.log(rightResults, devideLvl(lvlNumber)[2] - 1, lvlNumber);
            if (rightResults > devideLvl(lvlNumber)[2] - 1 && timeMs <= 30000) {
              setComplete([true, "right"]);
            } else if (timeMs <= 30000) {
              setComplete([false, "notright"]);
            } else {
              setComplete([false, "beOnTime"]);
            }
          })
          .catch(function (error) {
            console.warn(error);
          })
          .finally(() => {
            back();
          });
      })
      .catch(function (error) {
        back();
        console.warn(error);
      });
  }, []);

  const { isLoading } = useResultButtonDelay();

  return (
    <CustomPanel id={id}>
      <div className="main-div-resilt-page">
        <div className="lvl-res-headDiv">
          {complete ? (
            complete[0] ? (
              <Icon56CheckCircleOutline
                fill="#1A84FF"
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            ) : (
              <Icon56CancelCircleOutline
                fill="#FF2525"
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            )
          ) : (
            <Icon56RecentOutline
              fill="#1A84FF"
              style={{
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
          )}

          <Title
            className="lvl-res-title-div"
            style={{ color: appearance === "light" ? "" : "#fff" }}
          >
            {complete
              ? complete[0]
                ? "Уровень пройден!"
                : "Попробуйте снова"
              : "Подытоживаем результаты"}
          </Title>

          {complete &&
            complete[0] &&
            allTasks.length > devideLvl(lvlNumber)[2] && (
              <Title className="lvl-res-sub-title-div" weight="1">
                Неплохо!
              </Title>
            )}
          {complete && complete[1] === "beOnTime" && (
            <Title className="lvl-res-sub-title-div" weight="1">
              Вы не успели
            </Title>
          )}
          {complete && complete[1] === "notright" && (
            <Title className="lvl-res-sub-title-div" weight="1">
              Есть ошибки
            </Title>
          )}
          {!complete && (
            <Title className="lvl-res-sub-title-div" weight="1">
              Ждем...
            </Title>
          )}

          <div
            style={{ height: 30, marginTop: 12 }}
            className="lvl-res-clock-div"
          >
            <ClockIcon
              className="multiplayer-title-return"
              width={16}
              height={16}
              fill="#99A2AD"
              style={{
                display: "inline-block",
                paddingLeft: 5,
                marginTop: 5,
              }}
            />
            <Title
              style={{
                display: "inline-block",
                paddingLeft: 5,
                color: "#99A2AD",
                fontSize: 14,
              }}
            >
              {finishedTime && Math.round(finishedTime)} сек
            </Title>
          </div>

          <List className="all-task-list">
            {allTasks &&
              allTasks.map((item, idx) => {
                if (item.id) {
                  return (
                    <Cell
                      disabled={true}
                      className="all-task-cell"
                      key={idx}
                      before={
                        <div
                          style={{ width: 44, height: 44, paddingRight: 20 }}
                        >
                          {item.complete ? (
                            <Icon24DoneOutline
                              fill="#2BD328"
                              className="lvl-res-list-icon"
                              style={{ backgroundColor: "#EDF5F0" }}
                            />
                          ) : (
                            <Icon24CancelOutline
                              fill="#FF2525"
                              className="lvl-res-list-icon"
                              style={{ backgroundColor: "#F7ECEF" }}
                            />
                          )}
                        </div>
                      }
                      subtitle={"Ваш ответ: " + item.answer}
                    >
                      <Title
                        level="2"
                        className="inCell"
                        style={{
                          color: appearance === "light" ? "#000" : "#fff",
                        }}
                      >
                        {item.number1}
                        {item.sign}
                        {item.number3}={item.pcAnswer}
                      </Title>
                    </Cell>
                  );
                }
              })}
          </List>
        </div>
      </div>

      <div
        className="lvl-res-absolute-div"
        style={{
          background: appearance === "light" ? "#F7F7FA" : "#1D1D20",
        }}
      >
        <ButtonGroup className="result-buttonGroup" mode="vertical" gap="m">
          <div className="result-buttonRetry-div">
            {
              <Button
                disabled={isLoading}
                size="l"
                onClick={() => {
                  async function deleteAndStart() {
                    setFinishedTime(0);
                    setAllTasks([{}]);
                    playNext();
                  }
                  deleteAndStart();
                }}
                style={{
                  backgroundColor: "#1A84FF",
                  borderRadius: 100,
                }}
                className="result-buttonGroup-retry"
                appearance="accent"
                stretched
                before={
                  complete && lvlNumber !== 10 && complete[0] ? (
                    <Icon20ArrowRightOutline />
                  ) : (
                    <Icon24RefreshOutline width={20} height={20} />
                  )
                }
              >
                {complete && lvlNumber !== 10 && complete[0]
                  ? "Следующий уровень"
                  : "Попробовать снова"}
              </Button>
            }
          </div>
          <div className="result-buttonNotNow-div">
            <Button
              disabled={isLoading}
              className="result-buttonGroup-notNow"
              onClick={(e) => {
                setFinishedTime(0);

                setAllTasks([{}]);
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
    </CustomPanel>
  );
};

export default LvlResultPage;
