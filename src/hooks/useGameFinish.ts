import { back, setActiveViewPanel, useRouter } from "@blumjs/router";
import { useEffect } from "react";
import { PanelRoute, PopoutRoute, ViewRoute } from "../constants/router";
import { finishGame } from "../core/main";

export const useGameFinish = (
  timeLeft: number,
  panel: PanelRoute,
  addCond?: boolean
) => {
  const { activePopout } = useRouter();
  useEffect(() => {
    if (timeLeft === 0) {
      if (
        (activePopout === PopoutRoute.AlertFinishGame ||
          activePopout === undefined ||
          activePopout === null) &&
        (typeof addCond === "undefined" ||
          (typeof addCond === "boolean" && addCond))
      ) {
        finishGame({
          activePanel: panel,
          activePopout: activePopout as PopoutRoute | null | undefined,
        });
      } else if (activePopout === PopoutRoute.Loading) {
        console.log("remove loading");
        back();
      } else if (activePopout !== PopoutRoute.AlertFinishGame && activePopout) {
        back({
          afterBackHandledCallback: () => {
            setActiveViewPanel({
              view: ViewRoute.Main,
              panel: PanelRoute.Menu,
            });
          },
        });
      }
    }
  }, [timeLeft, activePopout, addCond]);
};
