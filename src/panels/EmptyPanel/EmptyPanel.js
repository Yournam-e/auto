import { Button, Div, Panel, Title } from "@vkontakte/vkui";

import "@vkontakte/vkui/dist/vkui.css";
import mainLogo from "../../img/yawning_face_3d.png";

export const EmptyPanel = ({ rt, appearance }) => {
  return (
    <Panel
      nav="empty_panel"
      style={{ background: appearance == "light" ? "#FFFFFF" : "#222222" }}
    >
      <Div className="emptyDivForCenter">
        <img
          style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
          src={mainLogo}
          width={64}
          height={64}
        />
        <Title style={{ textAlign: "center" }} level="1">
          Тут пусто
        </Title>
        <Title style={{ textAlign: "center" }} level="3" weight="3">
          Ссылка недействительна.
        </Title>
        <Button
          appearance="neutral"
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 12,
            padding: 4,
          }}
          onClick={() => {
            rt.replace("/");
          }}
        >
          Перейти на главную
        </Button>
      </Div>
    </Panel>
  );
};
