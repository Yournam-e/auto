import { Icon28AddSquareOutline } from "@vkontakte/icons";
import bridge from "@vkontakte/vk-bridge";
import {
  CardGrid,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Tooltip,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { EmptyDiv } from "../../components/EmptyDiv/EmptyDiv";
import "./Garage.css";
import CarCard from "./components/CarCard";

export const Garage = ({
  rt,
  carsInfo,
  setCarsInfo,
  setCurrentCar,
  setFriendView,
  appearance,
  setPopout,
  setCarData,
}) => {
  const [tooltip, setTooltip] = useState(false);

  useEffect(() => {
    setFriendView(false);
    async function getKeys() {
      const isShowOnboard =
        (await bridge.send("VKWebAppStorageGet", { keys: ["tooltip1"] }))
          .keys[0].value === "";
      setTooltip(isShowOnboard);
      await bridge.send("VKWebAppStorageSet", {
        key: `tooltip1`,
        value: "1",
      });
    }
    getKeys();
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://showtime.app-dich.com/api/auto/cars${window.location.search}`
      )
      .then(async function (response) {
        setCarsInfo(response.data);
      })
      .catch(function (error) {
        console.warn(error);
      });
  }, []);

  return (
    <Panel
      nav="home_panel"
      style={{ background: appearance == "light" ? "#FFFFFF" : "#222222" }}
    >
      <PanelHeader
        style={{ textAlign: "center" }}
        separator={false}
        before={
          <Tooltip
            appearance="neutral"
            isShown={tooltip}
            onClose={() => {
              setTooltip(false);
            }}
            text="Нажмите, чтобы добавить авто"
          >
            <PanelHeaderButton
              onClick={() => {
                rt.push("/addCar");
              }}
            >
              <Icon28AddSquareOutline />
            </PanelHeaderButton>
          </Tooltip>
        }
      >
        Гараж
      </PanelHeader>

      {carsInfo && (
        <div className="long-card-div">
          <CardGrid size="l">
            {carsInfo &&
              carsInfo.cars &&
              carsInfo.cars.map((elem, index) => {
                return (
                  <CarCard
                    key={index}
                    rt={rt}
                    data={elem}
                    setCurrentCar={setCurrentCar}
                    setPopout={setPopout}
                    setCarData={setCarData}
                  />
                );
              })}
          </CardGrid>
        </div>
      )}
      {carsInfo && carsInfo.cars && !carsInfo.cars.length && (
        <EmptyDiv emptyText="Вы ещё не добавили авто" />
      )}
    </Panel>
  );
};
