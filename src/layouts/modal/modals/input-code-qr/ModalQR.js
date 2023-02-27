import { useEffect } from "react";

import { back } from "@blumjs/router";
import {
  Button,
  ButtonGroup,
  Div,
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
import { $main } from "../../../../core/main";

export const ModalQRCode = ({ id }) => {
  const { joinCode } = useStore($main);
  let options = {};

  const platform = usePlatform();

  options.foregroundColor = "#0077FF";
  options.logoData = "https://i.ibb.co/xLkkGgd/vk-logo-3674340.png";

  const qrSvg = qr.createQR(
    `vk.com/app51451320#${joinCode}`,
    230,
    "qr-code",
    options
  );

  function share() {
    bridge
      .send("VKWebAppShare", {
        link: `https://vk.com/app51451320#${joinCode}`,
      })
      .then((data) => {
        back();
      })
      .catch((error) => {
        // Ошибка
        console.log(error);
      });
  }

  useEffect(() => {
    console.log(platform);
  }, []);

  return (
    <ModalPage
      id={id}
      header={
        <ModalPageHeader
          before={platform === "android" && <PanelHeaderClose onClick={back} />}
          after={
            platform === "ios" && (
              <PanelHeaderButton onClick={back}>
                <Icon24Dismiss />
              </PanelHeaderButton>
            )
          }
        ></ModalPageHeader>
      }
    >
      <Div>
        <Div>
          <div style={{ margin: 10 }} className="qr-code">
            <img src={`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`} />
          </div>
        </Div>

        <ButtonGroup
          style={{ marginTop: 20, marginBottom: 10 }}
          gap="space"
          className="qr-code-share-button-div"
        >
          <Button
            stretched
            size="s"
            before={<Icon24ShareOutline />}
            className="qr-code-share-button"
            appearance="accent"
            onClick={() => {
              share();
            }}
          >
            Поделиться
          </Button>
        </ButtonGroup>
      </Div>
    </ModalPage>
  );
};
