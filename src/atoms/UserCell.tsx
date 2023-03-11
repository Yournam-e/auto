import { Avatar, Cell, Title } from "@vkontakte/vkui";
import { useStore } from "effector-react";
import { memo } from "react";
import { $main } from "../core/main";
import "./UserCell.css";

type Props = {
  name?: string;
  avatar?: string;
};

export const UserCell = memo<Props>(({ name, avatar }) => {
  const { appearance } = useStore($main);
  return (
    <Cell
      before={
        avatar ? (
          <Avatar className="user_avatar_connected" src={avatar} />
        ) : (
          <div
            style={{
              borderColor: appearance === "light" ? "#E3E3E6" : "#38383B",
            }}
            className="noneUser"
          />
        )
      }
      disabled={name ? false : true}
    >
      {name ? (
        <Title
          level="3"
          weight="2"
          className={"player-name-on user_name_connected"}
        >
          {name}
        </Title>
      ) : (
        <Title level="3" weight="3" className="player-name-off">
          Пусто
        </Title>
      )}
    </Cell>
  );
});
