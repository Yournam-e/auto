import { ModalRoot } from "@vkontakte/vkui";
import { AddMileage } from "./AddMileage";
import { AddReapair } from "./AddRepair";
import { EditCar } from "./EditCar";
import { EditMileage } from "./EditMileage";
import { EditReapair } from "./EditRepair";
import { Preview } from "./Preview";

export const ModalLayout = ({
  activeModal,
  currentCar,
  setCarData,
  carData,
  setRepairsInfo,
  reapairsInfo,
  mileageInfo,
  setMileageInfo,
  currentRepair,
  routeNavigator,
  setSnackbar,
  setPopout,
  platform,
}) => {
  return (
    <ModalRoot
      activeModal={activeModal}
      onClose={() => routeNavigator.hideModal()}
    >
      <EditCar
        id="editCar"
        setCarData={setCarData}
        currentCar={currentCar}
        activeModal={activeModal}
        carData={carData}
        routeNavigator={routeNavigator}
      />
      <Preview
        id="previewCar"
        setCarData={setCarData}
        currentCar={currentCar}
        activeModal={activeModal}
        carData={carData}
        routeNavigator={routeNavigator}
        setSnackbar={setSnackbar}
        setPopout={setPopout}
        platform={platform}
      />
      <EditReapair
        id="editReapair"
        setCarData={setCarData}
        currentCar={currentCar}
        activeModal={activeModal}
        carData={carData}
        setRepairsInfo={setRepairsInfo}
        reapairsInfo={reapairsInfo}
        currentRepair={currentRepair}
        routeNavigator={routeNavigator}
      />
      <AddReapair
        id="addRepair"
        setCarData={setCarData}
        currentCar={currentCar}
        activeModal={activeModal}
        carData={carData}
        setRepairsInfo={setRepairsInfo}
        reapairsInfo={reapairsInfo}
        routeNavigator={routeNavigator}
        setPopout={setPopout}
      />
      <AddMileage
        id="addMileage"
        setCarData={setCarData}
        currentCar={currentCar}
        activeModal={activeModal}
        routeNavigator={routeNavigator}
        carData={carData}
        mileageInfo={mileageInfo}
        setMileageInfo={setMileageInfo}
        setPopout={setPopout}
      />
      <EditMileage
        id="editMileage"
        setCarData={setCarData}
        currentCar={currentCar}
        activeModal={activeModal}
        routeNavigator={routeNavigator}
        carData={carData}
        mileageInfo={mileageInfo}
        setMileageInfo={setMileageInfo}
      />
    </ModalRoot>
  );
};
