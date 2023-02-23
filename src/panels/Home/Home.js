import { useEffect, useState } from "react";

import { Alert, CardGrid, Panel, PanelHeader } from "@vkontakte/vkui";

import "./Home.css";

import axios from "axios";
import { qsSign } from "../../hooks/qs-sign";
import LevelCard from "./components/LevelCard";
import LongCard from "./components/LongCard";

import "../../img/Fonts.css";

const Home = ({
  id,
  setSingleType,
  setLocalTask,
  activePanel,
  setLvlData,
  lvlData,
  setLvlNumber,
  setReady,
  lvlNumber,
  themeColors,
  setPanelsHistory,
  panelsHistory,
  lvlsInfo,
  setLvlsInfo,
  gameExists,
  setConnectType,
  setGameExists,
}) => {
  const url = "https://showtime.app-dich.com/api/plus-plus/";

  const [completeArray, setCompleteArray] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const [completeLvls, setCompleteLvls] = useState([
    { id: "one", complete: false, needComplete: 8 },
    { id: "two", complete: false, needComplete: 8 },
    { id: "three", complete: false, needComplete: 8 },
    { id: "four", complete: false, needComplete: 8 },
    { id: "five", complete: false, needComplete: 8 },
    { id: "six", complete: false, needComplete: 8 },
    { id: "seven", complete: false, needComplete: 8 },
    { id: "eight", complete: false, needComplete: 8 },
    { id: "nine", complete: false, needComplete: 8 },
    { id: "ten", complete: false, needComplete: 8 },
  ]);

  useEffect(() => {}, [completeLvls]);

  function devideType(i) {
    switch (i) {
      case "one":
        return 1;
      case "two":
        return 2;
      case "three":
        return 3;
      case "four":
        return 4;
      case "five":
        return 5;
      case "six":
        return 6;
      case "seven":
        return 7;
      case "eight":
        return 8;
      case "nine":
        return 9;
      case "ten":
        return 10;
    }
  }

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

  useEffect(() => {
    document.body.classList.add("body-dark");
    axios
      .get(`${url}info${qsSign}`) //получил инфу о лвлах
      .then(async function (response) {
        await setLvlsInfo(response.data.data);
        response.data.data.map((item, index) => {
          setCompleteLvls([
            ...completeLvls.map((todo) =>
              item.lvlType === todo.id && item.rightResults > todo.needComplete
                ? { ...todo, complete: true }
                : { ...todo }
            ),
          ]);
        });
        if (gameExists === true) {
          setPopout(
            <Alert
              actions={[
                {
                  title: "Ок",
                  mode: "destructive",
                  autoclose: true,
                  action: () => {
                    setGameExists(false);
                    setConnectType("host");
                  },
                },
              ]}
              actionsLayout="vertical"
              onClose={() => {
                setGameExists(false);
                setPopout(null);
              }}
              header="Внимание"
              text="Игра уже запущена, попробуйте позже"
            />
          );
        }
      })
      .catch(function (error) {
        console.warn(error);
      });
  }, []);

  return (
    <Panel id={id}>
      <PanelHeader style={{ backgroundColor: "transparent" }}>
        Уровни{" "}
      </PanelHeader>
      <div className="long-card-div">
        <CardGrid size="l" style={{ marginBottom: 56 }}>
          <LongCard
            setSingleType={setSingleType}
            lvlsInfo={lvlsInfo}
            setLocalTask={setLocalTask}
            themeColors={themeColors}
          />

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => {
            return (
              <LevelCard
                key={number}
                number={number}
                lvlsInfo={lvlsInfo}
                setLvlData={setLvlData}
                lvlData={lvlData}
                setLvlNumber={setLvlNumber}
                setReady={setReady}
                themeColors={themeColors}
                devideLvl={devideLvl}
                completeArray={completeArray}
                completeLvls={completeLvls}
              />
            );
          })}
        </CardGrid>
      </div>
    </Panel>
  );
};

export default Home;
