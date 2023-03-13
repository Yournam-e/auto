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
import { useCallback, useEffect } from "react";

import { Icon28FavoriteOutline, Icon28Users3Outline } from "@vkontakte/icons";

import "@vkontakte/vkui/dist/vkui.css";
import "./App.css";
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
  createCatchBackBrowserRouteMiddleware,
  createDisableBackBrowserRouteMiddleware,
  createRouteMiddleware,
  setActivePanel,
  setActivePopout,
  setActiveViewPanel,
  useInitRouter,
  useRouter,
  _setActiveModal,
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
  joinToYourRoom,
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
  const {
    appearance,
    activeStory,
    user,
    gameInfo,
    connectType,
    playerLobbyList,
    joinCode,
  } = useStore($main);
  const { activePanel, activePopout, activeView, isRouteInit } = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.getElementById("root").style.overscrollBehavior = "none";
    return () => {
      document.body.style.overflow = "auto";
      document.getElementById("root").style.overscrollBehavior = "auto";
    };
  }, []);

  const leaveMultiplayerRoom = useCallback(() => {
    if (
      playerLobbyList &&
      playerLobbyList.length > 1 &&
      activePopout !== PopoutRoute.AlertGameExit
    ) {
      setActivePopout(PopoutRoute.AlertLobbyExit);
    } else {
      setConnectType("host");
      setActiveStory(StoryRoute.Single);
    }
  }, [activePopout, playerLobbyList]);
  useInitRouter(
    {
      view: ViewRoute.Main,
      panel: PanelRoute.Menu,
    },
    ...[
      PanelRoute.Result,
      PanelRoute.ResultLvl,
      PanelRoute.MultiplayerResult,
    ].map((p) =>
      createCatchBackBrowserRouteMiddleware(p, () => {
        setActivePanel(PanelRoute.Menu);
      })
    ),
    ...[
      PanelRoute.TemporaryGame,
      PanelRoute.LvlGame,
      PanelRoute.MultiplayerGame,
    ].map((p) =>
      createCatchBackBrowserRouteMiddleware(p, (s) => {
        if (!s.popout) {
          setActivePanel(p);
          setActivePopout(PopoutRoute.AlertFinishGame);
        }
      })
    ),
    createDisableBackBrowserRouteMiddleware(PopoutRoute.Loading),
    createCatchBackBrowserRouteMiddleware(PanelRoute.Menu, (s) => {
      if (s.modal || s.popout) {
        return false;
      }
      setActiveViewPanel({ view: ViewRoute.Main, panel: PanelRoute.Menu });
      if (activeStory === StoryRoute.Multiplayer) {
        leaveMultiplayerRoom();
      }
      if (activeStory === StoryRoute.Single) {
        bridge.send("VKWebAppClose", { status: "success" });
      }
    }),
    createRouteMiddleware((storeRoutes) => {
      if (!window.history.state || window.history.state.view === undefined) {
        setActiveViewPanel({ view: ViewRoute.Main, panel: PanelRoute.Menu });
        bridge.send("VKWebAppClose", { status: "success" });
        return false;
      }
      if (navigator.onLine) {
        return true;
      }
      setActiveViewPanel({
        view: ViewRoute.Main,
        panel: PanelRoute.NotConnection,
      });
      _setActiveModal(null);
      _setActivePopout(null);
      bridge.send("VKWebAppClose", { status: "success" });
      return false;
    })
  );

  useEventListener("offline", () => {
    setActivePanel(PanelRoute.NotConnection);
  });

  client.joinedRoom = ({ users }) => {
    users !== 0 ? setPlayerLobbyList(users) : console.log("");
    const newArr = users.map((u) => u.userId);
    setPlayersId(newArr);
  };

  client.gameStarted = ({ task, answers, id }) => {
    setTaskInfo(task);
    setAnswersInfo(answers);
    setGameInfo({ ...gameInfo, taskId: id });
    setActivePanel(PanelRoute.MultiplayerGame);
  };

  useEffect(() => {
    console.log(window.location.hash, "cash");
    const img = new Image();
    img.src = Eyes;

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
      setGameInfo({
        ...gameInfo,
        roomId: window.location.hash.slice(1),
      });
      setHaveHash(true);
      setConnectType("join");
      setActivePanel(PanelRoute.Menu);
      setActiveStory(StoryRoute.Multiplayer);
    } else if (!window.location.hash || window.location.hash === "#") {
      setHaveHash(null);
    } else {
      setGameInfo({
        ...gameInfo,
        roomId: window.location.hash.slice(1),
      });
      setHaveHash(true);
      setConnectType("join");
      setActiveStory(StoryRoute.Multiplayer);
    }
  }, []);

  useEffect(() => {
    const callback = async (e) => {
      if (e.detail.type === "VKWebAppUpdateConfig") {
        const theme = e.detail.data.appearance;
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
      if (e.detail.type === "VKWebAppViewHide") {
        console.log("app hidden");
        if (connectType === "join" && user && user.id) {
          setConnectType("host");
          leaveRoom(joinCode);
        }
      }
      if (e.detail.type === "VKWebAppViewRestore") {
        console.log("restored app");
        setConnectType("host");
        const user = await bridge.send("VKWebAppGetUserInfo");
        setUser(user);
        joinToYourRoom({ isFirstStart: true, gameInfo });
      }
    };
    bridge.subscribe(callback);
    return () => {
      bridge.unsubscribe(callback);
    };
  }, [user, gameInfo, connectType]);

  if (!isRouteInit) {
    return (
      <ConfigProvider appearance={appearance}>
        <AppRoot>
          <ScreenSpinner size="large" />
        </AppRoot>
      </ConfigProvider>
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
                              onClick={leaveMultiplayerRoom}
                              selected={activeStory === StoryRoute.Single}
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
                              onClick={() => {
                                setActiveStory(StoryRoute.Multiplayer);
                              }}
                              selected={activeStory === StoryRoute.Multiplayer}
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
