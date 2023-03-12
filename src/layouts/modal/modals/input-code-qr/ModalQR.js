import { back } from "@blumjs/router";
import {
  Button,
  ButtonGroup,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  PanelHeaderClose,
  usePlatform,
} from "@vkontakte/vkui";

import { Icon24Dismiss, Icon24ShareOutline } from "@vkontakte/icons";

import bridge from "@vkontakte/vk-bridge";
import "./ModalQR.css";

import qr from "@vkontakte/vk-qr";
import { useStore } from "effector-react";
import { useCallback, useMemo } from "react";
import { $main } from "../../../../core/main";

export const ModalQRCode = ({ id }) => {
  const { joinCode } = useStore($main);
  let options = useMemo(
    () => ({
      foregroundColor: "#0077FF",
      logoData: "https://i.ibb.co/xLkkGgd/vk-logo-3674340.png",
    }),
    []
  );

  const platform = usePlatform();

  const qrSvg = qr.createQR(
    `vk.com/app51451320#${joinCode}`,
    230,
    "qr-code",
    options
  );

  const share = useCallback(() => {
    bridge
      .send("VKWebAppShare", {
        link: `https://vk.com/app51451320#${joinCode}`,
      })
      .then((data) => {
        back();
      })
      .catch((error) => {
        console.log(error);
      });
  }, [joinCode]);

  return (
    <ModalPage
      id={id}
      header={
        <ModalPageHeader
          separator={false}
          before={platform === "android" && <PanelHeaderClose onClick={back} />}
          after={
            platform === "ios" && (
              <PanelHeaderButton onClick={back}>
                <Icon24Dismiss />
              </PanelHeaderButton>
            )
          }
        />
      }
    >
      <div>
        <div className="qr-code-container">
          <div className="qr-code">
            <img src={`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`} />
          </div>
        </div>

        <ButtonGroup
          style={{ marginTop: 40, marginBottom: 10 }}
          gap="space"
          className="qr-code-share-button-div"
        >
          <Button
            stretched
            size="s"
            before={<Icon24ShareOutline />}
            className="qr-code-share-button"
            appearance="accent"
            onClick={share}
          >
            Поделиться
          </Button>
        </ButtonGroup>
      </div>
    </ModalPage>
  );
};
