import { back, setActivePanel } from "@blumjs/router";
import { Alert } from "@vkontakte/vkui";
import { memo, useCallback } from "react";
import { PanelRoute } from "../../../../constants/router";
import { setAllTasks } from "../../../../core/main";

export const AlertFinishGamePopout = memo(() => {
  const handleAction = useCallback(() => {
    console.log("action fired");
    back();
    setAllTasks([{}]);
  }, []);
  const handleClose = useCallback(() => {
    console.log("close fired");
    setActivePanel(PanelRoute.Menu);
  }, []);

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
