import { back, setActivePanel } from "@blumjs/router";
import { Alert } from "@vkontakte/vkui";
import { memo, useCallback } from "react";
import { PanelRoute } from "../../../../constants/router";
import { setAllTasks } from "../../../../core/main";

export const AlertFinishGamePopout = memo(() => {
  const handleClose = useCallback(() => {
    back();
  }, []);
  const handleAction = useCallback(() => {
    back({
      afterBackHandledCallback: () => {
        setActivePanel(PanelRoute.Menu);
        setAllTasks([{}]);
      },
    });
  }, []);

  return (
    <Alert
      actions={[
        {
          title: "Завершить",
          mode: "destructive",
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
