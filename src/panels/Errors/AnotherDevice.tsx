import { useStore } from "effector-react";
import { memo } from "react";
import { CustomPanel } from "../../atoms/CustomPanel";
import { PanelRoute } from "../../constants/router";
import { $main } from "../../core/main";
import phoneSrc from "../../img/phone.png";
import "./Errors.css";

type Props = {
  id: PanelRoute.AnotherDevice;
};

export const AnotherDevice = memo<Props>(({ id }) => {
  const { appearance } = useStore($main);

  return (
    <CustomPanel id={id}>
      <div
        className="another_device"
        style={{ marginRight: "auto", marginLeft: "auto", marginTop: 24 }}
      >
        <div>
          <img src={phoneSrc} />
        </div>
        <div className="another_device__header">Сессия завершена</div>
        <div className="another_device__description">
          Вы зашли в мультиплеер с другого устройства.
        </div>
      </div>
    </CustomPanel>
  );
});
