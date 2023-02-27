import { back } from "@blumjs/router";
import { Alert } from "@vkontakte/vkui";
import { memo, useCallback } from "react";
import { setConnectType, setGameExists } from "../../../../core/main";

export const AlertGameExistPopout = memo(() => {
  const handleAction = useCallback(() => {
    setGameExists(false);
    setConnectType("host");
  }, []);
  const handleClose = useCallback(() => {
    setGameExists(false);
    back();
  }, []);

  return (
    <Alert
      actions={[
        {
          title: "Ок",
          mode: "destructive",
          autoclose: true,
          action: handleAction,
        },
      ]}
      actionsLayout="vertical"
      onClose={handleClose}
      header="Внимание"
      text="Игра уже запущена, попробуйте позже"
    />
  );
});
