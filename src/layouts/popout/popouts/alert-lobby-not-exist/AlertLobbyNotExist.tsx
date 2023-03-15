import { back } from "@blumjs/router";
import { Alert } from "@vkontakte/vkui";
import { useStore } from "effector-react";
import { memo, useCallback } from "react";
import { StoryRoute } from "../../../../constants/router";
import { $main, setActiveStory, setConnectType } from "../../../../core/main";
import { joinToYourRoom } from "../../../../core/main/effects";
import { leaveRoom } from "../../../../sockets/game";

export const AlertLobbyNotExist = memo(() => {
  const { joinCode, gameInfo, isFirstStart } = useStore($main);
  const handleClose = useCallback(() => {
    console.log("close fired routes");
    setConnectType("host");
    joinToYourRoom({ gameInfo, isFirstStart });
    if (joinCode) {
      leaveRoom(joinCode);
    }
    back();
  }, [joinCode, gameInfo, isFirstStart]);
  const handleActionCreate = useCallback(() => {
    handleClose();
  }, [handleClose]);
  const handleActionMenu = useCallback(() => {
    handleClose();
    setActiveStory(StoryRoute.Single);
  }, [handleClose]);

  return (
    <Alert
      actions={[
        {
          title: "Создать",
          mode: "destructive",
          action: handleActionCreate,
        },
        {
          title: "В меню",
          mode: "cancel",
          action: handleActionMenu,
        },
      ]}
      actionsLayout="horizontal"
      onClose={handleClose}
      header="Лобби не существует"
      text="Создать свою комнату?"
    />
  );
});
