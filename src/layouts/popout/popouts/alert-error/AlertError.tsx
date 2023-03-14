import { back, setActiveViewPanel } from "@blumjs/router";
import { Alert } from "@vkontakte/vkui";
import { memo, useCallback } from "react";
import { PanelRoute, ViewRoute } from "../../../../constants/router";

export const AlertError = memo(() => {
  const handleClose = useCallback(() => {
    back({
      afterBackHandledCallback: () => {
        setActiveViewPanel({ view: ViewRoute.Main, panel: PanelRoute.Menu });
      },
    });
  }, []);

  return (
    <Alert
      actions={[
        {
          title: "В меню",
          mode: "destructive",
          action: handleClose,
        },
      ]}
      actionsLayout="vertical"
      onClose={handleClose}
      header="Произошла ошибка"
      text="Что-то пошло не по плану..."
    />
  );
});
