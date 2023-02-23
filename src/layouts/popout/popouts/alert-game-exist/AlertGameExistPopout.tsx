import { back } from "@blumjs/router";
import { Alert } from "@vkontakte/vkui";
import { memo } from "react";
import { setConnectType, setGameExists } from "../../../../core/main/events";

export const AlertGameExistPopout = memo(() => {
  return (
    <Alert
      actions={[
        {
          title: "Ок",
          mode: "destructive",
          autoclose: true,
          action: () => {
            setGameExists(false);
            setConnectType("host");
          },
        },
      ]}
      actionsLayout="vertical"
      onClose={() => {
        setGameExists(false);
        back();
      }}
      header="Внимание"
      text="Игра уже запущена, попробуйте позже"
    />
  );
});
