import { Avatar, Cell, Title } from "@vkontakte/vkui";
import { useStore } from "effector-react";
import { memo } from "react";
import { $main } from "../core/main";

type Props = {
  index: number;
};

export const UserCell = memo<Props>(({ index }) => {
  const { playerLobbyList, appearance } = useStore($main);
  return (
    <Cell
      before={
        playerLobbyList[index] ? (
          <Avatar src={playerLobbyList[index].avatar} />
        ) : (
          <div
            style={{
              borderColor: appearance === "light" ? "#E3E3E6" : "#38383B",
            }}
            className="noneUser"
          />
        )
      }
      disabled={
        index === 0 ? true : false || playerLobbyList[index] ? false : true
      }
    >
      {playerLobbyList[index] ? (
        <Title level="3" weight="2" className="player-name-on">
          {playerLobbyList[index].name}
        </Title>
      ) : (
        <Title level="3" weight="3" className="player-name-off">
          Пусто
        </Title>
      )}
    </Cell>
  );
});
