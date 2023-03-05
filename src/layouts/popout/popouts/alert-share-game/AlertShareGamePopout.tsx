import { back, setActivePopout } from "@blumjs/router";
import bridge from "@vkontakte/vk-bridge";
import { Alert } from "@vkontakte/vkui";
import { useStore } from "effector-react";
import { memo, useCallback } from "react";
import { PopoutRoute } from "../../../../constants/router";
import { $main } from "../../../../core/main";

export const AlertShareGamePopout = memo(() => {
  const { joinCode } = useStore($main);
  const handleShare = useCallback(() => {
    back({
      afterBackHandledCallback: () => {
        setActivePopout(PopoutRoute.Loading);
        bridge
          .send("VKWebAppShare", {
            link: `https://vk.com/app51451320#${joinCode}`,
          })
          .then((data) => {
            console.log("share success", data);
          })
          .catch((error) => {
            console.log("share err", error);
          })
          .finally(back);
      },
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
          action: handleShare,
        },
        {
          title: "Потом",
          mode: "cancel",
          action: handleClose,
        },
      ]}
      onClose={handleClose}
      actionsLayout="vertical"
      header="Временно недоступно"
      text="Попробуйте поделиться ссылкой"
    />
  );
});
