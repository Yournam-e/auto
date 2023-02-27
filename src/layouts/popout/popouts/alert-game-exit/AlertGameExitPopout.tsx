import { back, setActivePanel } from "@blumjs/router";
import { Alert } from "@vkontakte/vkui";
import { useStore } from "effector-react";
import { memo, useCallback } from "react";
import { PanelRoute, StoryRoute } from "../../../../constants/router";
import {
  $main,
  setActiveStory,
  setConnectType,
  setLeavingRoom,
} from "../../../../core/main";
import { leaveRoom } from "../../../../sockets/game";

export const AlertGameExitPopout = memo(() => {
  const { user } = useStore($main);
  const handleClose = useCallback(() => {
    back();
  }, []);
  const handleAction = useCallback(() => {
    setLeavingRoom(true);
    setConnectType("host");
    leaveRoom(user.id);
    setActivePanel(PanelRoute.Menu);
    setActiveStory(StoryRoute.Multiplayer);
  }, [user?.id]);

  return (
    <Alert
      actions={[
        {
          title: "Завершить",
          mode: "destructive",
          autoclose: true,
          action: handleAction,
        },
        {
          title: "Отмена",
          autoclose: true,
          mode: "cancel",
        },
      ]}
      actionsLayout="vertical"
      onClose={handleClose}
      header="Подтвердите действие"
      text="Вы уверены, что хотите завершить игру?"
    />
  );
});
