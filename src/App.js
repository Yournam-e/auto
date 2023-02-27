import bridge from "@vkontakte/vk-bridge";
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  Epic,
  Panel,
  Root,
  ScreenSpinner,
  SplitCol,
  SplitLayout,
  Tabbar,
  TabbarItem,
  View,
} from "@vkontakte/vkui";
import { useEffect } from "react";

import { Icon28FavoriteOutline, Icon28Users3Outline } from "@vkontakte/icons";

import "@vkontakte/vkui/dist/vkui.css";
import Eyes from "./img/Eyes.png";
import "./img/Fonts.css";

import LvlGame from "./panels/Game/LvlGame";
import ResultPage from "./panels/Game/ResultPage/ResultPage";
import { Home } from "./panels/Home";
import MessengerLobby from "./panels/Messenger/MessengerLobby";
import { Multiplayer, MultiplayerGame } from "./panels/Multiplayer";

import LvlResultPage from "./panels/Game/ResultPage/LvlResultPage";
import TemporaryGame from "./panels/Game/TemporaryGame";
import LobbyForGuest from "./panels/Multiplayer/LobbyForGuest/LobbyForGuest";
import MultiplayerResult from "./panels/Multiplayer/mpResult/MultiplayerResult";
import NotConnection from "./panels/NotConnection/NotConnection";
import searchToObject from "./scripts/searchToObject";
import { client } from "./sockets/receiver";

import { useEventListener } from "./scripts/useEventListener";

import {
  blumRouter,
  createDisableBackBrowserRouteMiddleware,
  setActivePanel,
  setActivePopout,
  useInitRouter,
  useRouter,
  _setActivePopout,
} from "@blumjs/router";
import { useStore } from "effector-react";
import {
  PanelRoute,
  PopoutRoute,
  StoryRoute,
  ViewRoute,
} from "./constants/router";
import {
  $main,
  setActiveStory,
  setAnswersInfo,
  setAppearance,
  setConnectType,
  setGameInfo,
  setHaveHash,
  setPlayerLobbyList,
  setPlayersId,
  setTaskInfo,
  setUser,
} from "./core/main";
import { ModalLayout } from "./layouts/modal/ModalLayout";
import { PopoutLayout } from "./layouts/popout/PopoutLayout";
import { leaveRoom } from "./sockets/game";

const App = () => {
  const { appearance, activeStory, user, gameInfo, connectType, timeFinish } =
    useStore($main);

  useInitRouter(
    {
      view: ViewRoute.Main,
      panel: PanelRoute.Menu,
    },
    createDisableBackBrowserRouteMiddleware(
      PanelRoute.TemporaryGame,
      (s, prevRoutes) => {
        console.log("try close temp game");
        if (s.popout === PopoutRoute.AlertFinishGame) {
          _setActivePopout(null);
        } else {
          setActivePopout(PopoutRoute.AlertFinishGame);
        }
      }
    )
  );

  const { activePanel, activePopout, activeView, isRouteInit } = useRouter();
  useEffect(() => {
    console.log(blumRouter.subscribers);
  }, []);

  useEventListener("offline", () => {
    setActivePanel(PanelRoute.NotConnection);
  });

  client.joinedRoom = ({ users }) => {
    async function joinFunction() {
      // setPopout(<ScreenSpinner size='large' />)

      users !== 0 ? setPlayerLobbyList(users) : console.log("");

      setPlayersId(null);

      const newArr = [];
      for (const item of users) {
        //setPlayersId([...playersId, item.userId]);
        newArr.push(item.userId);
      }
      setPlayersId(newArr);
      //setPopout(null)
    }

    joinFunction();
  };

  client.gameStarted = ({ task, answers, id }) => {
    setTaskInfo(task);
    setAnswersInfo(answers);
    async function lol() {
      setGameInfo({ ...gameInfo, taskId: id });
    }
    lol();
    setActivePanel(PanelRoute.MultiplayerGame);
  };

  useEffect(() => {}, [timeFinish]);

  useEffect(() => {
    const img = new Image();
    img.src = Eyes;

    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === "VKWebAppUpdateConfig") {
        const theme = data.appearance;
        if (bridge.supports("VKWebAppSetViewSettings")) {
          if (theme === "dark") {
            bridge.send("VKWebAppSetViewSettings", {
              status_bar_style: "light",
              action_bar_color: "#1D1D20",
            });
          } else {
            bridge.send("VKWebAppSetViewSettings", {
              status_bar_style: "dark",
              action_bar_color: "#fff",
            });
          }
        }
        setAppearance(theme);
      }
    });

    async function fetchData() {
      const user = await bridge.send("VKWebAppGetUserInfo");
      setUser(user);
      setGameInfo({ ...gameInfo, userId: user.id });
    }
    fetchData();

    if (searchToObject().vk_ref === "im_attach_picker") {
      setActivePanel(PanelRoute.Menu);
      setActiveStory(StoryRoute.Multiplayer);
    } else if (
      searchToObject().vk_ref === "im_app_action" &&
      window.location.hash
    ) {
      async function startToHash() {
        setGameInfo({
          ...gameInfo,
          roomId: window.location.hash.slice(1),
        });
        setHaveHash(true);
        setConnectType("join");
        setActivePanel(PanelRoute.Menu);
        setActiveStory(StoryRoute.Multiplayer);
      }
      startToHash();
    } else if (!window.location.hash || window.location.hash === "#") {
      setHaveHash(false);
    } else {
      async function startToHash() {
        setGameInfo({
          ...gameInfo,
          roomId: window.location.hash.slice(1),
        });
        setHaveHash(true);
        setConnectType("join");
        setActiveStory(PanelRoute.Multiplayer);
      }
      startToHash();
    }
  }, []);

  const onStoryChange = (e) => setActiveStory(e.currentTarget.dataset.story);

  bridge.subscribe((e) => {
    if (e.detail.type === "VKWebAppViewHide") {
      if (connectType === "join") {
        setConnectType("host");
        leaveRoom(user.id);
      }
    }
  });

  console.log(isRouteInit);
  if (!isRouteInit) {
    return (
      <AppRoot>
        <ScreenSpinner size="large" />
      </AppRoot>
    );
  }
  return (
    <ConfigProvider appearance={appearance}>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout
            popout={activePopout ? <PopoutLayout /> : null}
            modal={<ModalLayout />}
          >
            <SplitCol>
              <Root activeView={activeView}>
                <View id={ViewRoute.Main} activePanel={activePanel}>
                  <Panel id={PanelRoute.Menu}>
                    <div
                      style={{
                        background:
                          appearance === "light" ? "#F7F7FA" : "#1D1D20",
                        height: window.pageYOffset,
                      }}
                    >
                      <Epic
                        activeStory={activeStory}
                        tabbar={
                          <Tabbar>
                            <TabbarItem
                              onClick={(e) => {
                                onStoryChange(e);
                                setConnectType("host");
                              }}
                              selected={activeStory === StoryRoute.Single}
                              data-story={StoryRoute.Single}
                              text={
                                <span
                                  style={{
                                    color:
                                      appearance === "light"
                                        ? activeStory === StoryRoute.Single
                                          ? "#2C2D2E"
                                          : "#99A2AD"
                                        : activeStory === StoryRoute.Single
                                        ? "#C4C8CC"
                                        : "#76787A",
                                  }}
                                >
                                  Уровни
                                </span>
                              }
                            >
                              <Icon28FavoriteOutline
                                style={{
                                  color:
                                    appearance === "light"
                                      ? activeStory === StoryRoute.Single
                                        ? "#2C2D2E"
                                        : "#99A2AD"
                                      : activeStory === StoryRoute.Single
                                      ? "#C4C8CC"
                                      : "#76787A",
                                }}
                              />
                            </TabbarItem>
                            <TabbarItem
                              onClick={onStoryChange}
                              selected={activeStory === StoryRoute.Multiplayer}
                              data-story={StoryRoute.Multiplayer}
                              text={
                                <span
                                  style={{
                                    color:
                                      appearance === "light"
                                        ? activeStory === StoryRoute.Multiplayer
                                          ? "#2C2D2E"
                                          : "#99A2AD"
                                        : activeStory === StoryRoute.Multiplayer
                                        ? "#C4C8CC"
                                        : "#76787A",
                                  }}
                                >
                                  Онлайн
                                </span>
                              }
                            >
                              <Icon28Users3Outline
                                style={{
                                  color:
                                    appearance === "light"
                                      ? activeStory === StoryRoute.Multiplayer
                                        ? "#2C2D2E"
                                        : "#99A2AD"
                                      : activeStory === StoryRoute.Multiplayer
                                      ? "#C4C8CC"
                                      : "#76787A",
                                }}
                              />
                            </TabbarItem>
                          </Tabbar>
                        }
                      >
                        <View
                          id={StoryRoute.Single}
                          activePanel={PanelRoute.Single}
                        >
                          <Home id={PanelRoute.Single} />
                        </View>

                        <View
                          id={StoryRoute.Multiplayer}
                          activePanel={PanelRoute.Multiplayer}
                        >
                          <Multiplayer id={PanelRoute.Multiplayer} />
                        </View>
                      </Epic>
                    </div>
                  </Panel>
                  <LvlGame id={PanelRoute.LvlGame} />
                  <MessengerLobby id={PanelRoute.MessengerLobby} />
                  <TemporaryGame id={PanelRoute.TemporaryGame} />
                  <ResultPage id={PanelRoute.Result} />
                  <MultiplayerGame id={PanelRoute.MultiplayerGame} />
                  <LvlResultPage id={PanelRoute.ResultLvl} />
                  <MultiplayerResult id={PanelRoute.MultiplayerResult} />
                  <LobbyForGuest id={PanelRoute.LobbyForGuest} />
                  <NotConnection id={PanelRoute.NotConnection} />
                </View>
              </Root>
            </SplitCol>
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
