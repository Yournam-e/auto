import { useEffect, useState } from "react";

import { CardGrid, Panel, PanelHeader } from "@vkontakte/vkui";

import "./Home.css";

import { useStore } from "effector-react";
import { qsSign } from "../../hooks/qs-sign";
import { LevelCard } from "./components/LevelCard";
import { LongCard } from "./components/LongCard";

import { setActivePopout } from "@blumjs/router";
import bridge from "@vkontakte/vk-bridge";
import { PopoutRoute } from "../../constants/router";
import { AX } from "../../core/data/fetcher";
import { $main, loadBestLvlsResult, setLvlsInfo } from "../../core/main";
import "../../img/Fonts.css";

export const Home = ({ id }) => {
  const { gameExists } = useStore($main);

  const url = "/api/plus-plus/";

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
    bridge
      .send("VKWebAppShowBannerAd", {
        banner_location: "bottom",
      })
      .then((data) => {
        if (data.result) {
          // Баннерная реклама отобразилась
        }
      })
      .catch((error) => {
        // Ошибка
        console.log(error);
      });
    document.body.classList.add("body-dark");
    AX.get(`${url}info${qsSign}`) //получил инфу о лвлах
      .then(async function (response) {
        setLvlsInfo(response.data.data);
        response.data.data.map((item) => {
          setCompleteLvls([
            ...completeLvls.map((todo) =>
              item.lvlType === todo.id && item.rightResults > todo.needComplete
                ? { ...todo, complete: true }
                : { ...todo }
            ),
          ]);
        });
        if (gameExists === true) {
          setActivePopout(PopoutRoute.AlertGameExist);
        }
      })
      .catch(function (error) {
        console.warn(error);
      })
      .finally(() => {
        loadBestLvlsResult();
      });
  }, []);

  return (
    <Panel id={id}>
      <PanelHeader style={{ backgroundColor: "transparent" }}>
        Уровни{" "}
      </PanelHeader>
      <div className="long-card-div">
        <CardGrid size="l" style={{ marginBottom: 56 }}>
          <LongCard />
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => {
            return (
              <LevelCard key={number} number={number} devideLvl={devideLvl} />
            );
          })}
        </CardGrid>
      </div>
    </Panel>
  );
};
