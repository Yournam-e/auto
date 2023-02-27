import { Icon24ClockOutline, Icon24Play } from "@vkontakte/icons";
import { Button, Card, Div, Title } from "@vkontakte/vkui";

import { useStore } from "effector-react";
import { memo, useCallback } from "react";
import { $main, checkToDelete } from "../../../core/main";
import "../Home.css";

export const LongCard = memo(() => {
  const { appearance, lvlsInfo } = useStore($main);
  const startGame = useCallback(() => {
    checkToDelete(lvlsInfo);
  }, [lvlsInfo]);

  return (
    <div className="long-card-div-div">
      <Card
        style={{
          backgroundColor: appearance === "dark" ? "#2C2C31" : "#FFFFFF",
          borderRadius: 24,
        }}
        className="long-card"
      >
        <div style={{ minHeight: 141 }}>
          <Icon24ClockOutline
            width={24}
            height={24}
            fill={appearance === "dark" ? "#FFFFFF" : "#6D7885"}
            className="long-card-icon"
            style={{
              backgroundColor: appearance === "dark" ? "#293950" : "#F7F7F7",
            }}
          />
          <Div>
            <div>
              <Title
                className="long-card-title"
                style={{
                  color: appearance === "dark" ? "#C4C8CC" : "#2C2D2E",
                }}
              >
                Попробуй 30-секундный режим
              </Title>
            </div>
            <div>
              <Title level="3" className="long-card-text">
                Реши как можно больше задач за 30 секунд
              </Title>
            </div>
          </Div>

          <Button
            className="button-long"
            onClick={startGame}
            data-to="temporaryGame"
            style={{
              backgroundColor: appearance === "dark" ? "#293950" : "#F4F9FF",
              color: "#1984FF",
              borderRadius: 25,
            }}
            before={<Icon24Play height={16} width={16} />}
            mode="accent"
            size="s"
          >
            Попробовать
          </Button>
        </div>
      </Card>
    </div>
  );
});
