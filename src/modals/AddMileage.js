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
import { useState } from "react";
import { checkMileageTask, compare } from "../utlis/functions";

export const AddMileage = ({
  currentCar,
  setMileageInfo,
  mileageInfo,
  carData,
  routeNavigator,
  setPopout,
}) => {
  const [mileage, setMileage] = useState();
  const [erorrs, setErrors] = useState(0);
  const params = useParams();
  const [load, setLoad] = useState(false);

  function addMileage() {
    if (load) {
      return;
    }
    if (!mileage) {
      setLoad(false);
      setErrors(1);
      return;
    }

    if (Number(mileage) < 0) {
      setLoad(false);
      setErrors(1);
      return;
    }

    if (Number(mileage) > 2000000) {
      setLoad(false);
      setErrors(2);
      return;
    }

    if (!Number.isInteger(Number(mileage))) {
      setLoad(false);
      setErrors(3);
      return;
    }

    const newItem = {
      mileage: Number(mileage),
    };
    axios
      .post(
        `https://showtime.app-dich.com/api/auto/cars/${params.id}/mileages${window.location.search}`,
        newItem
      )
      .then(async function (response) {
        let nn = [...mileageInfo, response.data];
        nn.sort(compare);
        setMileageInfo(nn);
        routeNavigator.hideModal([...mileageInfo, response.data]);
      })
      .catch(function (error) {
        setLoad(false);
      });
  }

  function onChangeMileage(e) {
    if (
      e.target.value < 2000000 &&
      e.target.value >= 0 &&
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
      id="addMileage"
      onClose={() => {
        routeNavigator.hideModal();
      }}
      header={<ModalPageHeader>Новая запись</ModalPageHeader>}
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
                setLoad(true);
                addMileage();
              }}
              style={{
                borderRadius: 20,
              }}
              className="result-buttonGroup-retry"
              appearance="neutral"
              stretched
              loading={load}
              disabled={load}
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
