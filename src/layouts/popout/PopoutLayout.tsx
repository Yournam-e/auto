import { useRouter } from "@blumjs/router";
import { memo, useEffect, useState } from "react";
import { PopoutRoute } from "../../constants/router";
import "./PopoutLayout.css";
import {
  AlertError,
  AlertFinishGamePopout,
  AlertGameExistPopout,
  AlertGameExitPopout,
  AlertLobbyExitPopout,
  AlertLobbyNotExist,
  AlertShareGamePopout,
  LoadingPopout,
} from "./popouts";
import { AlerLobby } from "./popouts/alert-lobby/AlertLobby";

export const PopoutLayout = memo(() => {
  const { activePopout } = useRouter();
  const [popout, setPopout] = useState<null | React.ReactNode>(null);
  useEffect(() => {
    if (activePopout) {
      setPopout(popouts[activePopout as keyof typeof PopoutRoute]);
    } else {
      setPopout(null);
    }
  }, [activePopout]);
  if (!popout) {
    return null;
  }

  return <div className="popout_layout">{popout}</div>;
});

const popouts = {
  [PopoutRoute.Loading]: <LoadingPopout />,
  [PopoutRoute.AlertLobby]: <AlerLobby />,
  [PopoutRoute.AlertGameExist]: <AlertGameExistPopout />,
  [PopoutRoute.AlertGameExit]: <AlertGameExitPopout />,
  [PopoutRoute.AlertLobbyNotExist]: <AlertLobbyNotExist />,
  [PopoutRoute.AlertShareGame]: <AlertShareGamePopout />,
  [PopoutRoute.AlertFinishGame]: <AlertFinishGamePopout />,
  [PopoutRoute.AlertLobbyExit]: <AlertLobbyExitPopout />,
  [PopoutRoute.AlertError]: <AlertError />,
};
