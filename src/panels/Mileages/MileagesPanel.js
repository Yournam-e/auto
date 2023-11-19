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
import {
  ActionSheet,
  ActionSheetItem,
  AdaptiveIconRenderer,
  Alert,
  Button,
  ButtonGroup,
  Div,
  Group,
  Header,
  List,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  SimpleCell,
  Title,
  Tooltip,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { renderToString } from "react-dom/server";
import mainLogo from "../../img/yawning_face_3d.png";
import { compare, reverse } from "../../utlis/functions";
import { Months } from "../../utlis/months";
import "./MileagesPanel.css";

export const MileagesPanel = ({
  carData,
  platform,
  setPopout,
  itFriendView,
  rt,
  setMileageInfo,
  mileageInfo,
  routeNavigator,
  appearance,
}) => {
  const [tooltips, setTooltips] = useState([false, false]);
  const [infoForChart, setInfoForChart] = useState([]);
  const itemsRef = useRef([]);

  const onClose = () => setPopout(null);

  async function setKeys() {
    const isShowOnboard =
      (
        await bridge.send("VKWebAppStorageGet", {
          keys: ["MileagesPanelTooltip2"],
        })
      ).keys[0].value === "";
    setTooltips([tooltips[0], isShowOnboard]);
    await bridge.send("VKWebAppStorageSet", {
      key: `MileagesPanelTooltip1`,
      value: "1",
    });
  }

  useEffect(() => {
    async function getKeys() {
      const isShowOnboard =
        (
          await bridge.send("VKWebAppStorageGet", {
            keys: ["MileagesPanelTooltip2"],
          })
        ).keys[0].value === "";
      setTooltips([isShowOnboard, tooltips[1]]);
      await bridge.send("VKWebAppStorageSet", {
        key: `MileagesPanelTooltip2`,
        value: "1",
      });
    }
    getKeys();
  }, []);

  async function removeMileageTask(rId) {
    await axios
      .delete(
        `https://showtime.app-dich.com/api/auto/cars/${carData.id}/mileages/${rId}${window.location.search}`
      )
      .then(async function (response) {
        setMileageInfo([
          ...mileageInfo.filter((el) => Number(el.id) !== Number(rId)),
        ]);
      })
      .catch(function (error) {
        console.warn(error);
      });
  }

  useEffect(() => {
    if (mileageInfo && mileageInfo.length !== 0) {
      setKeys();
    }
    if (mileageInfo) {
      setInfoForChart(reverse(mileageInfo));
    }
  }, [mileageInfo]);

  useEffect(() => {
    if (carData && carData.mileages) {
      carData.mileages.sort(compare);
    }
    carData ? setMileageInfo(carData.mileages) : rt.push("/");
  }, []);

  return (
    <Panel
      nav="mileages_panel"
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
        Пробег
      </PanelHeader>

      {mileageInfo && mileageInfo.length != 0 && (
        <div>
          <Group
            style={{ marginRight: 12, marginLeft: 12 }}
            mode="plain"
            separator="hide"
            header={
              <Header mode="primary" size="large">
                График
              </Header>
            }
          >
            <div className="chart">
              <ReactApexChart
                options={{
                  xaxis: {
                    show: false,
                    labels: {
                      show: false,
                    },
                    tooltip: {
                      enabled: false,
                    },
                  },
                  grid: {
                    show: false,
                  },
                  yaxis: {
                    show: false,
                  },
                  legend: {
                    show: true,
                  },
                  chart: {
                    selection: {
                      enabled: true,
                    },
                    zoom: {
                      enabled: false,
                    },
                    toolbar: {
                      show: false,
                    },
                    height: 131,
                    stacked: false,
                    type: "area",
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  stroke: {
                    curve: "smooth",
                  },
                  tooltip: {
                    custom: function ({
                      series,
                      seriesIndex,
                      dataPointIndex,
                      w,
                    }) {
                      var data =
                        w.globals.initialSeries[seriesIndex].data[
                          dataPointIndex
                        ];

                      return renderToString(
                        <div
                          style={{
                            background:
                              appearance === "light" ? "#fff" : "#19191A",
                            padding: 3,
                          }}
                        >
                          <span
                            style={{
                              color:
                                appearance === "light" ? "#19191A" : "#fff",
                            }}
                          >
                            {Number(data)}км
                          </span>
                        </div>
                      );
                    },
                  },
                }}
                series={[
                  {
                    name: "series1",
                    color: "#000000",
                    data: infoForChart
                      ? infoForChart.map((item) => item.mileage)
                      : [],
                  },
                ]}
                type="area"
                height={151}
              />
            </div>
          </Group>

          <Group
            style={{ marginRight: 12, marginLeft: 12 }}
            mode="plain"
            header={
              <Header mode="primary" size="large">
                Полный список
              </Header>
            }
          >
            <List style={{ marginTop: 12, marginBottom: 160 }}>
              {mileageInfo &&
                mileageInfo.map((elem, index) => {
                  return (
                    <Tooltip
                      appearance="neutral"
                      isShown={itFriendView == false && tooltips[1]}
                      onClose={() => {
                        setTooltips([false, false]);
                      }}
                      text="Нажмите, чтобы редактировать запись"
                    >
                      <SimpleCell
                        key={index}
                        getRootRef={(el) => {
                          itemsRef.current[index] = el;
                        }}
                        className="repairsPanelDiscBlockAS1"
                        style={{ marginTop: 10 }}
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
                                      `/carPanel/${carData.id}/mileages/${elem.id}`
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
                                              removeMileageTask(elem.id);
                                            },
                                          },
                                          {
                                            title: "Отмена",
                                            autoClose: true,
                                            mode: "cancel",
                                          },
                                        ]}
                                        actionsLayout="vertical"
                                        onClose={() =>
                                          routeNavigator.hidePopout()
                                        }
                                        header="Подтвердите действие"
                                        text="Вы уверены, что хотите удалить запись о пробеге?"
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
                        before={
                          <div className="repairsDateBlock">
                            <div
                              className="dataInRepairItem1"
                              sryle={{
                                background:
                                  appearance == "light" ? "#FFFFFF" : "#19191A",
                              }}
                            >
                              <Title
                                level="1"
                                weight="1"
                                style={{
                                  letterSpacing: "-0.5px",
                                  textAlign: "center",
                                  color:
                                    appearance == "light"
                                      ? "#424242"
                                      : "#E1E3E6",
                                }}
                              >
                                {new Date(elem.created).getDate()}
                              </Title>
                              <Title
                                level="3"
                                style={{
                                  textAlign: "center",
                                  color:
                                    appearance == "light"
                                      ? "#424242"
                                      : "#E1E3E6",
                                  marginTop: "-5px",
                                  marginBottom: "auto",
                                }}
                              >
                                {Months[new Date(elem.created).getMonth()]}
                              </Title>
                            </div>
                          </div>
                        }
                      >
                        <Title
                          level="3"
                          className="repairsPanelName1"
                          style={{
                            color:
                              appearance == "light" ? "#424242" : "#E1E3E6",
                          }}
                        >
                          {elem.mileage}км
                        </Title>
                      </SimpleCell>
                    </Tooltip>
                  );
                })}
            </List>
          </Group>
        </div>
      )}

      {mileageInfo && mileageInfo.length == 0 && (
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
              ? "Владелец авто ещё не добавил записей о пробеге"
              : "Вы ещё не добавили записей о пробеге"}
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
                  routeNavigator.showModal("addMileage");
                }}
              >
                Добавить
              </Button>
            )}
          </Tooltip>
        </Div>
      )}

      {mileageInfo && mileageInfo.length != 0 && (
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
                routeNavigator.showModal("addMileage");
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
