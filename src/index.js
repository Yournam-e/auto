import bridge from "@vkontakte/vk-bridge";
import {
  RouterProvider,
  createHashRouter,
} from "@vkontakte/vk-mini-apps-router";
import { AdaptivityProvider, AppRoot, ConfigProvider } from "@vkontakte/vkui";
import { createRoot } from "react-dom/client";
import App from "./App";
// Init VK  Mini App
bridge.send("VKWebAppInit");
const root = createRoot(document.getElementById("root"));
//import("./eruda").then(({ default: eruda }) => {}); //if app in bug-tracker, will be uncomment

const router = createHashRouter([
  {
    path: "/",
    panel: "home_panel",
    view: "default_view",
  },
  {
    path: "/contacts",
    panel: "contacts_panel",
    view: "default_view",
  },
  {
    path: "/addCar",
    panel: "add_panel",
    view: "default_view",
  },
  {
    path: "/carPanel/:id",
    panel: "car_panel",
    view: "default_view",
  },
  {
    path: "/carPanel/:id/repairs",
    panel: "repair_panel",
    view: "default_view",
  },
  {
    path: "/carPanel/:id/mileages",
    panel: "mileages_panel",
    view: "default_view",
  },
  {
    path: `/carPanel/:id/repairs/:repId`,
    modal: "editReapair",
    panel: "repair_panel",
    view: "default_view",
  },
  {
    path: `/carPanel/:id/mileages/:milId`,
    modal: "editMileage",
    panel: "mileages_panel",
    view: "default_view",
  },
  {
    path: `/carPanel/:carId/preview`,
    modal: "previewCar",
    panel: "car_panel",
    view: "default_view",
  },
  {
    path: `/preview/:guid`,
    panel: "car_preview",
    view: "default_view",
  },
  {
    path: `/notFound`,
    panel: "empty_panel",
    view: "default_view",
  },
]);

root.render(
  <ConfigProvider>
    <AdaptivityProvider>
      <AppRoot>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </AppRoot>
    </AdaptivityProvider>
  </ConfigProvider>
);
