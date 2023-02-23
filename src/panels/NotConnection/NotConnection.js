import { useEffect } from "react";

import { Button, Panel, ScreenSpinner, Text, Title } from "@vkontakte/vkui";

import "../Home/Home.css";

import "../../img/Fonts.css";

const NotConnection = ({
  id,
  go,
  setPopout,
  themeColors,
  setActivePanel,
  setActiveStory,
  Eyes,
}) => {
  useEffect(() => {
    setPopout(null);
  }, []);

  function updateOnlineStatus(event) {
    if (navigator.onLine) {
      setActiveStory("single");
      setActivePanel("menu");
      setPopout(null);
    } else {
      setPopout(null);
    }
  }

  return (
    <Panel id={id}>
      <div
        style={{ background: themeColors === "light" ? "#F7F7FA" : "#1D1D20" }}
      >
        <div
          className="not-Connection--main-div"
          style={{ marginRight: "auto", marginLeft: "auto", marginTop: 24 }}
        >
          <Title level="3" style={{ textAlign: "center", marginTop: 24 }}>
            √-1
          </Title>

          <Text
            className="result-getFriend-text"
            style={{ textAlign: "center" }}
          >
            Проверьте доступ к интернету и попробуйте снова
          </Text>

          <div className="result-task-button-div">
            <Button
              className="result-getFriend-button"
              onClick={() => {
                setPopout(<ScreenSpinner size="large" />);
                updateOnlineStatus();
              }}
              style={{
                backgroundColor: themeColors === "dark" ? "#293950" : "#F4F9FF",
                color: "#1984FF",
                borderRadius: 25,
                marginBottom: 24,
              }}
              mode="accent"
              size="l"
            >
              Обновить
            </Button>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default NotConnection;
