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
import { useEventListener } from "./scripts/useEventListener";
import { client } from "./sockets/receiver";

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
  cleanUpperLayout,
  joinToYourRoom,
  setActiveStory,
  setAppearance,
  setConnectType,
  setGameInfo,
  setHaveHash,
  setUser,
  toOffline,
} from "./core/main";
import { ModalLayout } from "./layouts/modal/ModalLayout";
import { PopoutLayout } from "./layouts/popout/PopoutLayout";
import { AnotherDevice } from "./panels/Errors";
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
    isFirstStart,
  } = useStore($main);
  const {
    activePanel,
    activePopout,
    activeModal,
    activeView,
    isRouteInit,
    isBackFromBrowser,
  } = useRouter();

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
          if (p !== PanelRoute.MultiplayerGame) {
            setActivePanel(p);
            setActivePopout(PopoutRoute.AlertFinishGame);
          } else {
            setActivePanel(p);
            setActivePopout(PopoutRoute.AlertGameExit);
          }
        }
      })
    ),
    createCatchBackBrowserRouteMiddleware(PopoutRoute.AlertError, () => {
      setActiveViewPanel({ view: ViewRoute.Main, panel: PanelRoute.Menu });
      _setActivePopout(null);
    }),
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
    createCatchBackBrowserRouteMiddleware(PanelRoute.AnotherDevice, () => {
      setActiveViewPanel({
        view: ViewRoute.Main,
        panel: PanelRoute.AnotherDevice,
      });
      bridge.send("VKWebAppClose", { status: "success" });
    }),
    createRouteMiddleware(() => {
      if (!window.history.state || window.history.state.view === undefined) {
        setActiveViewPanel({ view: ViewRoute.Main, panel: PanelRoute.Menu });
        bridge.send("VKWebAppClose", { status: "success" });
        return false;
      }
      if (navigator.onLine) {
        return true;
      }
      if (isBackFromBrowser) {
        toOffline();
        _setActiveModal(null);
        _setActivePopout(null);
        bridge.send("VKWebAppClose", { status: "success" });
        return false;
      }
      return true;
    })
  );
  useEventListener("offline", () => {
    if (connectType === "join") {
      setConnectType("host");
      leaveRoom(joinCode);
    }
    cleanUpperLayout({
      activeModal,
      activePopout,
      callback: () => {
        setActivePanel(PanelRoute.NotConnection);
      },
    });
  });

  useEffect(() => {
    console.log(window.location.hash, "cash");
    const img = new Image();
    img.src = Eyes;

    if (isRouteInit) {
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
    }
  }, [isRouteInit]);

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
      if (
        e.detail.type === "VKWebAppChangeFragment" ||
        e.detail.type === "VKWebAppViewHide" ||
        e.detail.type === "VKWebAppCloseResult"
      ) {
        console.log("app closed");
        setConnectType("host");
        joinToYourRoom({ gameInfo, isFirstStart });
        leaveRoom(joinCode);
      }
      if (e.detail.type === "VKWebAppViewRestore") {
        console.log("restored app");
        setConnectType("host");
        const user = await bridge.send("VKWebAppGetUserInfo");
        setUser(user);
      }
    };
    bridge.subscribe(callback);
    client.activeDevice = () => {
      cleanUpperLayout({
        activeModal,
        activePopout,
        callback: () => {
          setActivePanel(PanelRoute.AnotherDevice);
        },
      });
      console.debug("using another device");
    };
    return () => {
      bridge.unsubscribe(callback);
      client.activeDevice = () => {};
    };
  }, [user, gameInfo, connectType, client, activeModal, activePopout]);

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
                        minHeight: "100vh",
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
                  <AnotherDevice id={PanelRoute.AnotherDevice} />
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
