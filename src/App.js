import bridge from "@vkontakte/vk-bridge";
import {
  useActiveVkuiLocation,
  useGetPanelForView,
  usePopout,
  useRouteNavigator,
} from "@vkontakte/vk-mini-apps-router";
import { Root, SplitLayout, View } from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import { useEffect, useState } from "react";
import { ModalLayout } from "./modals/ModalLayout";
import { AddCar } from "./panels/AddCar";
import { CarPanel } from "./panels/Car/CarPanel";
import { EmptyPanel } from "./panels/EmptyPanel/EmptyPanel";
import { ForFriend } from "./panels/ForFriend/ForFriend";
import { Garage } from "./panels/Garage";
import { MileagesPanel } from "./panels/Mileages/MileagesPanel";
import { RepairPanel } from "./panels/Repair/RepairPanel";
import { checkOnboard } from "./utlis/checkOnboard";

const App = () => {
  const [appearance, setAppearance] = useState("light");
  const [popout, setPopout] = useState(null);

  const [snackbar, setSnackbar] = useState(null);

  const { view: activeView } = useActiveVkuiLocation();
  const activePanel = useGetPanelForView("default_view");
  const routeNavigator = useRouteNavigator();
  const [activePopout, setActivePopout] = useState(false);
  const { modal: activeModal } = useActiveVkuiLocation();
  const [carsInfo, setCarsInfo] = useState();
  const [currentCar, setCurrentCar] = useState();
  const [carData, setCarData] = useState(null);
  const [repairsInfo, setRepairsInfo] = useState();
  const [mileageInfo, setMileageInfo] = useState();
  const [currentRepair, setCurrentRepair] = useState();
  const [platform, setPlatform] = useState();
  const [itFriendView, setFriendView] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [closeAdd, setCloseAdd] = useState(false);
  const routerPopout = usePopout();

  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    checkOnboard();
    bridge
      .send("VKWebAppGetClientVersion")
      .then((data) => {
        if (data.platform) {
          setPlatform(data.platform);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    bridge
      .send("VKWebAppGetConfig")
      .then((data) => {
        if (data.api_host) {
          setAppearance(data.appearance);
        }
      })
      .catch((error) => {
        // Ошибка
        console.log(error);
      });

    if (!showAdd) {
      if (Math.floor(Math.random() * 2) == 0) {
        bridge
          .send("VKWebAppShowBannerAd", {
            banner_location: "bottom",
          })
          .then((data) => {
            if (data.result) {
              setShowAdd(true);
            }
          })
          .catch((error) => {
            // Ошибка
            setShowAdd(true);
          });
      } else {
        setShowAdd(true);
      }
    }
  }, []);

  return (
    <SplitLayout
      modal={
        <ModalLayout
          activeModal={activeModal}
          currentCar={currentCar}
          setCarData={setCarData}
          carData={carData}
          reapairsInfo={repairsInfo}
          setRepairsInfo={setRepairsInfo}
          mileageInfo={mileageInfo}
          setMileageInfo={setMileageInfo}
          currentRepair={currentRepair}
          routeNavigator={routeNavigator}
          setSnackbar={setSnackbar}
          setPopout={setPopout}
          platform={platform}
        />
      }
      popout={[routerPopout, popout]}
    >
      <Root activeView={activeView} nav="default_root">
        <View nav="default_view" activePanel={activePanel}>
          <Garage
            nav="home_panel"
            appearance={appearance}
            rt={routeNavigator}
            carsInfo={carsInfo}
            setCarsInfo={setCarsInfo}
            setCurrentCar={setCurrentCar}
            setFriendView={setFriendView}
            setPopout={setPopout}
            setCarData={setCarData}
          ></Garage>
          <AddCar
            nav="add_panel"
            rt={routeNavigator}
            platform={platform}
            appearance={appearance}
          ></AddCar>
          <CarPanel
            nav="car_panel"
            rt={routeNavigator}
            routeNavigator={routeNavigator}
            setCurrentCar={setCurrentCar}
            carData={carData}
            setCarData={setCarData}
            setFriendView={setFriendView}
            appearance={appearance}
            setPopout={setPopout}
            photoUrl={photoUrl}
            setPhotoUrl={setPhotoUrl}
            itFriendView={itFriendView}
          ></CarPanel>
          <ForFriend
            nav="car_preview"
            appearance={appearance}
            rt={routeNavigator}
            routeNavigator={routeNavigator}
            setCurrentCar={setCurrentCar}
            carData={carData}
            setCarData={setCarData}
            setFriendView={setFriendView}
          />
          <RepairPanel
            nav="repair_panel"
            setPopout={setPopout}
            carData={carData}
            routeNavigator={routeNavigator}
            rt={routeNavigator}
            repairsInfo={repairsInfo}
            setRepairsInfo={setRepairsInfo}
            setCurrentRepair={setCurrentRepair}
            platform={platform}
            itFriendView={itFriendView}
            appearance={appearance}
          />
          <MileagesPanel
            nav="mileages_panel"
            carData={carData}
            routeNavigator={routeNavigator}
            rt={routeNavigator}
            mileageInfo={mileageInfo}
            setMileageInfo={setMileageInfo}
            platform={platform}
            setPopout={setPopout}
            itFriendView={itFriendView}
            appearance={appearance}
          />
          <EmptyPanel
            nav="empty_panel"
            rt={routeNavigator}
            appearance={appearance}
          />
        </View>
      </Root>
      {snackbar}
    </SplitLayout>
  );
};

export default App;
