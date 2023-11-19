import { Div, Title } from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import mainLogo from "../../img/racing_car_3d.png";
import "./csd.css";
export const EmptyDiv = ({ emptyText }) => {
  return (
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
        {emptyText}.
      </Title>
    </Div>
  );
};
