import { back, useRouter } from "@blumjs/router";
import { ModalRoot } from "@vkontakte/vkui";
import { memo, useCallback } from "react";
import { ModalRoute } from "../../constants/router";
import { ConnectType, GameInfo } from "../../types";
import { ModalInputCode, ModalQRCode } from "./modals";

type Props = {
  setGameInfo: (opts: GameInfo) => void;
  gameInfo: GameInfo;
  setJoinCode: (joinCode: string) => void;
  setConnectType: (ct: ConnectType) => void;
  platform: string;
  joinCode: string;
};

export const ModalLayout = memo<Props>(
  ({
    setGameInfo,
    gameInfo,
    setJoinCode,
    setConnectType,
    platform,
    joinCode,
  }) => {
    const { activeModal } = useRouter();
    const handleClose = useCallback(() => {
      back();
    }, []);

    return (
      <ModalRoot onClose={handleClose} activeModal={activeModal}>
        <ModalInputCode
          id={ModalRoute.InputCode}
          setGameInfo={setGameInfo}
          gameInfo={gameInfo}
          setJoinCode={setJoinCode}
          setConnectType={setConnectType}
          platform={platform}
          joinCode={joinCode}
        />
        <ModalQRCode id={ModalRoute.InputCodeQR} joinCode={joinCode} />
      </ModalRoot>
    );
  }
);
