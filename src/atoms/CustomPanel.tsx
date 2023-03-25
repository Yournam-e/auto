import { Panel } from "@vkontakte/vkui";
import { useStore } from "effector-react";
import { memo } from "react";
import { PanelRoute } from "../constants/router";
import { $main } from "../core/main";

type Props = {
  id: PanelRoute;
  className?: string;
  style?: object;
  children: React.ReactNode;
};

export const CustomPanel = memo<Props>(({ id, style, className, children }) => {
  const { appearance } = useStore($main);

  return (
    <Panel id={id} className={className}>
      <div
        style={{
          background: appearance === "light" ? "#F7F7FA" : "#1D1D20",
          minHeight: "100vh",
          overflowY: "auto",
          ...style,
        }}
      >
        {children}
      </div>
    </Panel>
  );
});
