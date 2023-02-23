import { back } from "@blumjs/router";
import { Alert } from "@vkontakte/vkui";
import { memo, useCallback } from "react";

export const AlerLobby = memo(() => {
  const handleClose = useCallback(() => {
    back();
  }, []);

  return (
    <Alert
      actions={[
        {
          title: "Ок",
          mode: "destructive",
          autoclose: true,
          action: () => {},
        },
      ]}
      actionsLayout="vertical"
      onClose={handleClose}
      header="Внимание"
      text="Лобби не существует или было удалено"
    />
  );
});
