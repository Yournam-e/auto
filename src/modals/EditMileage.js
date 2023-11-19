import { useParams } from "@vkontakte/vk-mini-apps-router";
import {
  Button,
  ButtonGroup,
  FormItem,
  FormLayout,
  FormLayoutGroup,
  Group,
  Input,
  ModalPage,
  ModalPageHeader,
} from "@vkontakte/vkui";
import axios from "axios";
import { useEffect, useState } from "react";
import { checkMileageTask } from "../utlis/functions";

export const EditMileage = ({
  currentCar,
  setMileageInfo,
  mileageInfo,
  carData,
  routeNavigator,
}) => {
  const [mileage, setMileage] = useState();
  const [erorrs, setErrors] = useState(0);
  const params = useParams();

  useEffect(() => {
    if (mileageInfo) {
      console.log(mileageInfo);
      setMileage(
        mileageInfo
          ? mileageInfo.find((element) => element.id == Number(params.milId))
              .mileage
          : ""
      );
    }
  }, []);

  function editMileage() {
    if (!mileage) {
      setErrors(1);
      return;
    }

    if (Number(mileage) < 0) {
      setErrors(1);
      return;
    }

    if (Number(mileage) > 2000000) {
      setErrors(2);
      return;
    }

    if (!Number.isInteger(Number(mileage))) {
      setErrors(3);
      return;
    }

    const newItem = {
      mileage: Number(mileage),
      id: mileageInfo.find((el) => el.id === Number(params.milId)).id,
      created: mileageInfo.find((el) => el.id === Number(params.milId)).created,
    };
    axios
      .put(
        `https://showtime.app-dich.com/api/auto/cars/${
          params.id
        }/mileages/${Number(params.milId)}${window.location.search}`,
        newItem
      )
      .then(async function (response) {
        setMileageInfo([
          ...mileageInfo.map((item) =>
            item.id === Number(params.milId) ? { ...newItem } : { ...item }
          ),
        ]);
        routeNavigator.hideModal();
      })
      .catch(function (error) {
        console.warn(error);
      });
  }

  function onChangeMileage(e) {
    if (
      e.target.value < 2000000 &&
      e.target.value >= 1 &&
      Number.isInteger(Number(mileage))
    ) {
      setErrors(0);
    }
    if (e.target.value > 2000000) {
      setMileage(2000000);
      return;
    }

    setMileage(e.target.value);
  }
  return (
    <ModalPage
      id="editMileage"
      onClose={() => {
        routeNavigator.hideModal();
      }}
      header={<ModalPageHeader>Изменить запись</ModalPageHeader>}
    >
      <Group>
        <FormLayout>
          <FormLayoutGroup mode="vertical">
            <FormItem
              top="Текущий пробег"
              status={erorrs == 0 ? "default" : "error"}
              bottom={checkMileageTask(erorrs)}
            >
              <Input
                id="name"
                type="number"
                value={mileage}
                onChange={onChangeMileage}
              />
            </FormItem>
          </FormLayoutGroup>
        </FormLayout>
        <ButtonGroup
          style={{ marginTop: 12 }}
          className="result-buttonGroup"
          mode="vertical"
          gap="m"
        >
          <div className="result-buttonRetry-div">
            <Button
              size="l"
              onClick={() => {
                editMileage();
              }}
              style={{
                borderRadius: 20,
              }}
              className="result-buttonGroup-retry"
              appearance="neutral"
              stretched
            >
              Добавить
            </Button>
          </div>
          <div className="result-buttonNotNow-div">
            <Button
              className="result-buttonGroup-notNow"
              size="l"
              style={{
                borderRadius: 25,
                marginBottom: 20,
              }}
              appearance="neutral"
              mode="tertiary"
              onClick={() => {
                routeNavigator.hideModal();
              }}
              stretched
            >
              Отмена
            </Button>
          </div>
        </ButtonGroup>
      </Group>
    </ModalPage>
  );
};
