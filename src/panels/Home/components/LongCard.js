import { Icon24ClockOutline, Icon24Play } from "@vkontakte/icons";
import { Button, Card, Div, Title } from "@vkontakte/vkui";

import { useStore } from "effector-react";
import { memo, useCallback, useMemo } from "react";
import { $main, checkToDelete } from "../../../core/main";
import { decOfNum } from "../../../scripts/decOfNum";
import "../Home.css";

export const LongCard = memo(() => {
  const { appearance, lvlsInfo, bestLvlsResult } = useStore($main);
  const bestResult = useMemo(
    () =>
      bestLvlsResult.some((b) => b.lvlType === "single30")
        ? bestLvlsResult.filter((b) => b.lvlType === "single30")[0].best
        : -1,
    [bestLvlsResult]
  );
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
                {bestResult > 0 ? "" : "Попробуйте "}30-секундный режим
              </Title>
            </div>
            {bestResult > 0 && (
              <div>
                <Title
                  level="1"
                  className="long-card-text"
                  style={{
                    color: appearance === "light" ? "#6D7885" : "#909499",
                  }}
                >
                  Ваш рекорд:{" "}
                  {decOfNum(bestResult, ["балл", "балла", "баллов"])}
                </Title>
              </div>
            )}
            <div>
              <Title
                level="3"
                className="long-card-text"
                style={{
                  color: appearance === "light" ? "#818C99" : "#76787A",
                }}
              >
                Решите как можно больше задач за 30 секунд
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
