import { back, useRouter } from "@blumjs/router";
import { ModalRoot } from "@vkontakte/vkui";
import { memo, useCallback } from "react";
import { ModalRoute } from "../../constants/router";
import { ModalInputCode, ModalQRCode } from "./modals";

export const ModalLayout = memo(() => {
  const { activeModal } = useRouter();
  const handleClose = useCallback(() => {
    back();
  }, []);

  return (
    <ModalRoot onClose={handleClose} activeModal={activeModal}>
      <ModalInputCode id={ModalRoute.InputCode} />
      <ModalQRCode id={ModalRoute.InputCodeQR} />
    </ModalRoot>
  );
});
