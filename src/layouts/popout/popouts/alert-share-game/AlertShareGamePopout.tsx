import { back } from "@blumjs/router";
import bridge from "@vkontakte/vk-bridge";
import { Alert } from "@vkontakte/vkui";
import { useStore } from "effector-react";
import { memo, useCallback } from "react";
import { $main } from "../../../../core/main";

export const AlertShareGamePopout = memo(() => {
  const { joinCode } = useStore($main);
  const handleShare = useCallback(() => {
    back();
    bridge
      .send("VKWebAppShare", {
        link: `https://vk.com/app51451320#${joinCode}`,
      })
      .then((data) => {
        console.log("share success", data);
      })
      .catch((error) => {
        console.log("share err", error);
      });
  }, [joinCode]);
  const handleClose = useCallback(() => {
    back();
  }, []);

  return (
    <Alert
      actions={[
        {
          title: "Поделиться",
          mode: "destructive",
          autoclose: true,
          action: handleShare,
        },
        {
          title: "Потом",
          mode: "cancel",
          autoclose: true,
          action: handleShare,
        },
      ]}
      onClose={handleClose}
      actionsLayout="vertical"
      header="Временно недоступно"
      text="Попробуйте поделиться ссылкой"
    />
  );
});
