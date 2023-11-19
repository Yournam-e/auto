import {
  Icon20DeleteOutline,
  Icon20DeleteOutlineAndroid,
  Icon20WriteOutline,
  Icon28ArrowLeftOutline,
  Icon28DeleteOutline,
  Icon28DeleteOutlineAndroid,
  Icon28EditOutline,
} from "@vkontakte/icons";

import bridge from "@vkontakte/vk-bridge";
import mainLogo from "../../img/yawning_face_3d.png";

import {
  ActionSheet,
  ActionSheetItem,
  AdaptiveIconRenderer,
  Alert,
  Button,
  ButtonGroup,
  Div,
  List,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  SimpleCell,
  Text,
  Title,
  Tooltip,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Months } from "../../utlis/months";
import "./RepairPanel.css";

export const RepairPanel = ({
  carData,
  rt,
  setRepairsInfo,
  repairsInfo,
  setPopout,
  routeNavigator,
  setCurrentRepair,
  platform,
  itFriendView,
  appearance,
}) => {
  const [tooltips, setTooltips] = useState([false, false]);
  const itemsRef = useRef([]);
  const onClose = () => setPopout(null);

  useEffect(() => {
    if (repairsInfo && repairsInfo.length !== 0) {
      setKeys();
    }
  }, [repairsInfo]);

  async function setKeys() {
    const isShowOnboard =
      (
        await bridge.send("VKWebAppStorageGet", {
          keys: ["RepairPanelTooltip2"],
        })
      ).keys[0].value === "";
    setTooltips([tooltips[0], isShowOnboard]);
    await bridge.send("VKWebAppStorageSet", {
      key: `RepairPanelTooltip2`,
      value: "1",
    });
  }

  async function removeRepairTask(rId) {
    await axios
      .delete(
        `https://showtime.app-dich.com/api/auto/cars/${carData.id}/repairs/${rId}${window.location.search}`
      )
      .then(async function (response) {
        setRepairsInfo([
          ...repairsInfo.filter((el) => Number(el.id) !== Number(rId)),
        ]);
      })
      .catch(function (error) {
        console.warn(error);
      });
  }

  useEffect(() => {
    if (carData && carData.repairs) {
      carData.repairs.sort(compare);
    }
    carData ? setRepairsInfo(carData.repairs) : rt.push("/");

    async function getKeys() {
      const isShowOnboard =
        (
          await bridge.send("VKWebAppStorageGet", {
            keys: ["RepairPanelTooltip1"],
          })
        ).keys[0].value === "";
      setTooltips([isShowOnboard, tooltips[1]]);
      await bridge.send("VKWebAppStorageSet", {
        key: `RepairPanelTooltip1`,
        value: "1",
      });
    }
    getKeys();
  }, []);

  function compare(a, b) {
    var dateA = new Date(a.created);
    var dateB = new Date(b.created);

    return dateB - dateA;
  }

  useEffect(() => {
    if (repairsInfo) {
      repairsInfo.sort(compare);
    }
  }, [repairsInfo]);

  return (
    <Panel
      nav="repair_panel"
      style={{ background: appearance == "light" ? "#FFFFFF" : "#222222" }}
    >
      <PanelHeader
        style={{ textAlign: "center" }}
        separator={false}
        before={
          <PanelHeaderButton
            onClick={() => {
              rt.back();
            }}
          >
            <Icon28ArrowLeftOutline />
          </PanelHeaderButton>
        }
      >
        Ремонты
      </PanelHeader>

      <List
        style={{
          marginTop: 12,
          marginBottom: 160,
          marginRight: 12,
          marginLeft: 12,
        }}
      >
        {repairsInfo &&
          repairsInfo.map((elem, index) => {
            return (
              <div>
                <Tooltip
                  appearance="neutral"
                  isShown={itFriendView == false && tooltips[1]}
                  onClose={() => {
                    setTooltips([false, false]);
                  }}
                  text="Нажмите, чтобы редактировать запись"
                >
                  <SimpleCell
                    getRootRef={(el) => {
                      itemsRef.current[index] = el;
                    }}
                    before={
                      <div className="repairsDateBlock">
                        <div
                          className="dataInRepairItem"
                          style={{
                            background:
                              appearance == "light" ? "#E1E3E6" : "#424242",
                          }}
                        >
                          <Title
                            level="1"
                            weight="1"
                            style={{
                              letterSpacing: "-0.5px",
                              textAlign: "center",
                              color:
                                appearance == "light" ? "#424242" : "#E1E3E6",
                            }}
                          >
                            {new Date(elem.created).getDate()}
                          </Title>
                          <Title
                            level="3"
                            style={{
                              textAlign: "center",
                              color:
                                appearance == "light" ? "#424242" : "#E1E3E6",
                              marginTop: "-5px",
                              marginBottom: "auto",
                            }}
                          >
                            {Months[new Date(elem.created).getMonth()]}
                          </Title>
                        </div>
                      </div>
                    }
                    subtitle={
                      <div>
                        <Text className="repairsPanelDisc">
                          <span
                            style={{
                              color:
                                appearance == "light" ? "#424242" : "#E1E3E6",
                            }}
                          >
                            {elem.description}
                          </span>{" "}
                          {elem.description && elem.repairValue ? "·" : ""}
                          <span
                            style={{ color: "#5A5A5A" }}
                            className="repairsPanelDiscSpan"
                          >
                            {elem.repairValue == 0 ? "" : elem.repairValue}
                            {elem.repairValue ? "руб" : ""}
                          </span>
                        </Text>
                      </div>
                    }
                    multiline={true}
                    onClick={() => {
                      if (!itFriendView) {
                        setPopout(
                          <ActionSheet
                            onClose={onClose}
                            toggleRef={itemsRef.current[index]}
                          >
                            <ActionSheetItem
                              autoClose
                              before={
                                <AdaptiveIconRenderer
                                  IconCompact={Icon20WriteOutline}
                                  IconRegular={Icon28EditOutline}
                                />
                              }
                              onClick={() => {
                                routeNavigator.push(
                                  `/carPanel/${carData.id}/repairs/${elem.id}`
                                );
                              }}
                            >
                              Редактировать
                            </ActionSheetItem>
                            <ActionSheetItem
                              autoClose
                              mode="destructive"
                              onClick={() => {
                                rt.showPopout(
                                  <Alert
                                    actions={[
                                      {
                                        title: "Удалить",
                                        mode: "destructive",
                                        autoClose: true,
                                        action: () => {
                                          removeRepairTask(elem.id);
                                        },
                                      },
                                      {
                                        title: "Отмена",
                                        autoClose: true,
                                        mode: "cancel",
                                      },
                                    ]}
                                    actionsLayout="vertical"
                                    onClose={() => routeNavigator.hidePopout()}
                                    header="Подтвердите действие"
                                    text="Вы уверены, что хотите удалить запись о ремонте?"
                                  />
                                );
                              }}
                              before={
                                <AdaptiveIconRenderer
                                  IconCompact={
                                    platform === "ios"
                                      ? Icon20DeleteOutline
                                      : Icon20DeleteOutlineAndroid
                                  }
                                  IconRegular={
                                    platform === "ios"
                                      ? Icon28DeleteOutline
                                      : Icon28DeleteOutlineAndroid
                                  }
                                />
                              }
                            >
                              Удалить
                            </ActionSheetItem>
                          </ActionSheet>
                        );
                      }
                    }}
                  >
                    <Title className="repairsPanelName">{elem.title}</Title>
                  </SimpleCell>
                </Tooltip>
              </div>
            );
          })}
      </List>
      {repairsInfo && repairsInfo.length == 0 && (
        <Div className="emptyDivForCenter">
          <img
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            src={mainLogo}
            width={64}
            height={64}
          />
          <Title style={{ textAlign: "center" }} level="1">
            Тут пусто
          </Title>
          <Title style={{ textAlign: "center" }} level="3" weight="3">
            {itFriendView
              ? "Владелец авто ещё не добавил записей о ремонте"
              : "Вы ещё не добавили записей о ремонте"}
          </Title>

          <Tooltip
            appearance="neutral"
            isShown={itFriendView == false && tooltips[0]}
            onClose={() => {
              setTooltips([false, tooltips[1]]);
            }}
            text="Нажмите, чтобы добавить запись"
          >
            {!itFriendView && (
              <Button
                appearance="neutral"
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: 12,
                  padding: 4,
                }}
                onClick={() => {
                  routeNavigator.showModal("addRepair");
                }}
              >
                Добавить
              </Button>
            )}
          </Tooltip>
        </Div>
      )}

      {repairsInfo && repairsInfo.length != 0 && (
        <ButtonGroup
          mode="vertical"
          gap="m"
          className="result-absolute-div"
          style={{
            marginTop: 43,
            paddingLeft: 20,
            paddingRight: 20,
            background: appearance === "light" ? "#FFFFFF" : "#19191A",
          }}
        >
          <div className="result-buttonRetry-div">
            <Button
              size="l"
              onClick={() => {
                routeNavigator.showModal("addRepair");
              }}
              style={{
                borderRadius: 20,
              }}
              className="result-buttonGroup-retry"
              appearance="neutral"
              stretched={true}
              disabled={itFriendView}
            >
              Добавить данные
            </Button>
          </div>
        </ButtonGroup>
      )}
    </Panel>
  );
};
