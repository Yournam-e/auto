import { back, setActivePanel, setActivePopout } from "@blumjs/router";
import {
  Icon16Done,
  Icon24RefreshOutline,
  Icon24StoryOutline,
  Icon56CheckCircleOutline,
} from "@vkontakte/icons";
import bridge from "@vkontakte/vk-bridge";
import {
  Avatar,
  Button,
  ButtonGroup,
  Cell,
  Div,
  List,
  Text,
  Title,
} from "@vkontakte/vkui";
import axios from "axios";
import { createCanvas } from "canvas";
import { useStore } from "effector-react";
import { useCallback, useEffect, useState } from "react";
import { CustomPanel } from "../../../atoms/CustomPanel";
import { PanelRoute, PopoutRoute } from "../../../constants/router";
import { $main, checkToDelete } from "../../../core/main";
import { qsSign } from "../../../hooks/qs-sign";
import Eyes from "../../../img/Eyes.png";
import "../Game.css";

const ResultPage = ({ id }) => {
  const { user, appearance, answer } = useStore($main);
  const url = "https://showtime.app-dich.com/api/plus-plus/";

  const [lvlsInfo, setLvlsInfo] = useState(null);

  const [rightAns, setRightAns] = useState();

  const [right, setRight] = useState(null);

  const [friendsIds, setFriendsIds] = useState(null); //id друзей юзера
  const [friendsResult, setFriendsResult] = useState(); //результаты друзей

  const [tokenAvailability, setTokenAvailability] = useState(false);

  function decOfNum(number, titles, needNumber = true) {
    if (number !== undefined) {
      let decCache = [],
        decCases = [2, 0, 1, 1, 1, 2];
      if (!decCache[number])
        decCache[number] =
          number % 100 > 4 && number % 100 < 20
            ? 2
            : decCases[Math.min(number % 10, 5)];
      return (needNumber ? number + " " : "") + titles[decCache[number]];
    }
  }

  async function loadFonts(fonts = []) {
    new Promise((resolve, reject) => {
      try {
        if (fonts.length === 0) {
          resolve();
        }
        for (const font of fonts) {
          const span = document.createElement("span");
          span.style.position = "absolute";
          span.style.fontFamily = font;
          span.style.opacity = "0";
          span.innerText = ".";
          document.body.appendChild(span);
          span.onload = () => {
            span.remove();
            resolve();
          };
        }
      } catch (e) {
        console.log(e);
        reject();
      }
    });
  }

  function loadImage(url) {
    return new Promise((r) => {
      let i = new Image();
      i.onload = () => r(i);
      i.src = url;
      i.crossOrigin = "anonymous";
    });
  }

  async function showStoryBox(count) {
    setActivePopout(PopoutRoute.Loading);
    await loadFonts(["Manrope"]);
    function getUrlParams() {
      return (
        window.location.search.length > 0 &&
        JSON.parse(
          '{"' +
            decodeURI(window.location.search.substring(1))
              .replace(/"/g, '\\"')
              .replace(/&/g, '","')
              .replace(/=/g, '":"') +
            '"}'
        )
      );
    }
    const background = await loadImage(
      "https://showtime.app-dich.com/imgs/plusstory.webp"
    );
    background.setAttribute("crossOrigin", "anonymous");
    const phrases = [
      decOfNum(count, [
        "Математическую задачу",
        "Математические задачи",
        "Математических задач",
      ]),
      " за ",
      "30 секунд!",
    ];
    var canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(background, 0, 0);

    ctx.font = "700 189px Manrope";
    ctx.fillStyle = "#1A84FF";
    ctx.textAlign = "center";
    ctx.fillText(count, 540, 709 + 133);

    ctx.font = "500 63px Manrope";
    ctx.fillStyle = "#333333";
    ctx.textAlign = "center";
    ctx.fillText(phrases[0], 540, 1032 + 52);

    const width1 = ctx.measureText(phrases[1] + phrases[2]).width,
      width2 = ctx.measureText(phrases[1]).width;
    ctx.textAlign = "left";
    ctx.fillText(phrases[1], (background.width - width1) / 2, 1118 + 48);
    ctx.font = "800 63px Manrope";
    ctx.fillStyle = "#1A84FF";
    ctx.fillText(
      phrases[2],
      (background.width - width1) / 2 + width2,
      1118 + 48
    );

    try {
      await bridge.send("VKWebAppShowStoryBox", {
        background_type: "image",
        blob: canvas.toDataURL("image/png"),
        attachment: {
          url: `https://vk.com/app${getUrlParams().vk_app_id}`,
          text: "go_to",
          type: "url",
        },
      });
    } catch (e) {
      console.log("show story box err", e);
    } finally {
      back();
    }
  }

  const playAgain = useCallback(() => {
    checkToDelete(lvlsInfo);
  }, [lvlsInfo]);

  function getIds(result) {
    if (result === true) {
      bridge
        .send("VKWebAppGetAuthToken", {
          app_id: 51451320,
          scope: "friends",
        })
        .then((data) => {
          if (data.access_token) {
            bridge
              .send("VKWebAppCallAPIMethod", {
                method: "friends.get",
                params: {
                  user_ids: "743784474,743784479",
                  v: "5.131",
                  access_token: data.access_token,
                },
              })
              .then((friendsData) => {
                if (friendsData.response) {
                  setFriendsIds(friendsData.response);
                  setTokenAvailability(true);
                }
              })
              .catch((error) => {});
          }
        })
        .catch((error) => {});
    }
  } ///получи id друзей

  async function сheckFriends() {
    var params = await window.location.search
      .replace("?", "")
      .split("&")
      .reduce(function (p, e) {
        var a = e.split("=");
        p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
        return p;
      }, {});

    await console.log(params.vk_access_token_settings.includes("friends"));

    if (params.vk_access_token_settings.includes("friends") === true) {
      getIds(true);
    }
  } //в useEffect

  async function getFriendsAndCheck() {
    const promise = new Promise((resolve, reject) => {
      var params = window.location.search
        .replace("?", "")
        .split("&")
        .reduce(function (p, e) {
          var a = e.split("=");
          p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
          return p;
        }, {});

      params.vk_access_token_settings.includes("friends")
        ? resolve(true)
        : resolve(true);
    });
    promise.then((result) => result === true && getIds(result));
  } //// получи друзей и чекай token'ы (при нажатии)

  useEffect(() => {
    if (friendsIds) {
      axios
        .post(
          `https://showtime.app-dich.com/api/plus-plus/rating/friends${qsSign}`,
          {
            ids: friendsIds.items,
          }
        )
        .then(async function (response) {
          setFriendsResult(response.data);
          for await (const item of response.data.data) {
            if (item.user.userId === user.id) {
              setRightAns(item.rightResults);
            }
          }
        })
        .catch(function (error) {});
    }
  }, [friendsIds]);

  function decOfNum(number, titles, needNumber = true) {
    if (number !== undefined) {
      let decCache = [],
        decCases = [2, 0, 1, 1, 1, 2];
      if (!decCache[number])
        decCache[number] =
          number % 100 > 4 && number % 100 < 20
            ? 2
            : decCases[Math.min(number % 10, 5)];
      return (needNumber ? number + " " : "") + titles[decCache[number]];
    }
  }

  useEffect(() => {
    сheckFriends();

    axios
      .put(`https://showtime.app-dich.com/api/plus-plus/lvl${qsSign}`, {
        id: answer.id,
        lvlType: answer.lvlType,
        answers: answer.answers,
      })
      .then(async function (response) {
        axios
          .get(`${url}info${qsSign}`) //получил инфу о лвлах
          .then(async function (res) {
            await setLvlsInfo(res.data.data);
            for await (const item of res.data.data) {
              if (item.lvlType === "single30") {
                setRight(item.rightResults);
              }
            }
          })
          .catch(function (error) {});
      })
      .catch(function (error) {});
  }, []);

  return (
    <CustomPanel id={id} className="resultPagePanel">
      <Div className="check-circle-outline">
        <div>
          <Icon56CheckCircleOutline
            fill="#1A84FF"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          />
        </div>
        <div style={{ marginLeft: "auto", marginRight: "auto", marginTop: 16 }}>
          {
            <Title className="result-task-title">
              {right
                ? `${decOfNum(right, ["балл", "балла", "баллов"])}`
                : "0 баллов"}
            </Title>
          }
        </div>

        <div style={{ marginLeft: 18, marginRight: 18, marginTop: 16 }}>
          <Title className="result-task-text">
            {right !== null && right !== 0 ? "Неплохо!" : ""} Поделись
            результатами с друзьями:
          </Title>
        </div>

        <div
          className="result-task-button-div"
          style={{ marginLeft: "auto", marginRight: "auto", marginTop: 16 }}
        >
          <Button
            onClick={async function () {
              if (right !== null) {
                showStoryBox(right);
              }
            }}
            className="result-task-button"
            style={{
              backgroundColor: appearance === "dark" ? "#293950" : "#F4F9FF",
              color: "#1984FF",
              borderRadius: 25,
            }}
            before={<Icon24StoryOutline height={16} width={16} />}
            mode="accent"
            size="l"
          >
            Поделиться в истории
          </Button>
        </div>
        <p className="hide">content</p>
        {tokenAvailability === true && (
          <div>
            <div className="result-task-resTitle-div">
              <Title className="result-task-resTitle">Результаты друзей:</Title>
            </div>

            <List className="result-friendList" style={{ marginTop: 8 }}>
              {friendsResult &&
                friendsResult.data.map((item, idx) => (
                  <Cell
                    style={{ marginLeft: 5, marginRight: 5 }}
                    key={idx}
                    before={
                      <div style={{ width: 100 }}>
                        <Avatar
                          size={56}
                          className="friendsAvatar"
                          src={item.user.avatar}
                        />{" "}
                        <Title
                          style={{ verticalAlign: "middle" }}
                          className="result-friend-position"
                        >
                          #{idx + 1}
                        </Title>
                      </div>
                    }
                  >
                    <div style={{ height: 65, marginLeft: 16 }}>
                      <Title level="3" style={{ paddingBottom: 8 }}>
                        {item.user.name}
                      </Title>

                      <Button
                        className="friendsPoint"
                        before={<Icon16Done />}
                        hasActive={false}
                        hasHover={false}
                        style={{
                          backgroundColor:
                            appearance === "dark" ? "#293950" : "#F4F9FF",
                          color: "#1984FF",
                          borderRadius: 25,
                        }}
                      >
                        <p style={{ textAlign: "center" }}>
                          {item.rightResults}
                        </p>
                      </Button>
                    </div>
                  </Cell>
                ))}
            </List>
          </div>
        )}

        {tokenAvailability === false && (
          <div style={{ marginBottom: 160 }}>
            <div
              className="notFriend-div"
              style={{
                marginRight: "auto",
                marginLeft: "auto",
                marginTop: 24,
              }}
            >
              <img
                className="eyes-photo"
                style={{ marginTop: 16 }}
                src={Eyes}
                width={44}
                height={44}
              ></img>

              <Title level="3" style={{ textAlign: "center" }}>
                Тут никого нет
              </Title>

              <Text
                className="result-getFriend-text"
                style={{ textAlign: "center" }}
              >
                Разрешите доступ к списку друзей, чтобы видеть их результаты
              </Text>

              <div className="result-task-button-div">
                <Button
                  className="result-getFriend-button"
                  onClick={() => {
                    setActivePopout(PopoutRoute.Loading);
                    getFriendsAndCheck();
                  }}
                  style={{
                    backgroundColor:
                      appearance === "dark" ? "#293950" : "#F4F9FF",
                    color: "#1984FF",
                    borderRadius: 25,
                    marginBottom: 24,
                  }}
                  mode="accent"
                  size="l"
                >
                  Разрешить доступ
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="result-absolute-div">
          <ButtonGroup className="result-buttonGroup" mode="vertical" gap="m">
            <div className="result-buttonRetry-div">
              <Button
                size="l"
                style={{
                  backgroundColor: "#1A84FF",
                  borderRadius: 100,
                }}
                before={<Icon24RefreshOutline />}
                className="result-buttonGroup-retry"
                appearance="accent"
                onClick={playAgain}
                stretched
              >
                Попробовать снова
              </Button>
            </div>
            <div className="result-buttonNotNow-div">
              <Button
                className="result-buttonGroup-notNow"
                onClick={() => {
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
      </Div>
    </CustomPanel>
  );
};

export default ResultPage;
