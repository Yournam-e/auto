import { back } from "@blumjs/router";
import { Alert } from "@vkontakte/vkui";
import { useStore } from "effector-react";
import { memo, useCallback } from "react";
import { StoryRoute } from "../../../../constants/router";
import { $main, setActiveStory, setConnectType } from "../../../../core/main";
import { leaveRoom } from "../../../../sockets/game";

export const AlertLobbyExitPopout = memo(() => {
  const { joinCode } = useStore($main);
  const handleClose = useCallback(() => {
    back();
  }, []);
  const handleActionExit = useCallback(() => {
    if (joinCode) {
      leaveRoom(joinCode);
    }
    setConnectType("host");
    setActiveStory(StoryRoute.Single);
  }, [joinCode]);
  const handleActionCancel = useCallback(() => {}, []);
  return (
    <Alert
      actions={[
        {
          title: "Выйти",
          mode: "cancel",
          autoclose: true,
          action: handleActionExit,
        },
        {
          title: "Остаться",
          mode: "destructive",
          autoclose: true,
          action: handleActionCancel,
        },
      ]}
      actionsLayout="horizontal"
      onClose={handleClose}
      header="Выход из лобби"
      text="Вы хотите покинуть комнату?"
    />
  );
});
