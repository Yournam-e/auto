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
import { checkSPZ, checkVIN } from "../utlis/functions";
import { SPZ_REGEXP, VIN_REGEXP } from "../utlis/regExp";

export const EditCar = ({
  activeModal,
  setActiveModal,
  currentCar,
  setCarData,
  routeNavigator,
  carData,
}) => {
  const [name, setName] = useState(currentCar.name);
  const [year, setYear] = useState(currentCar.releaseYear);
  const [spz, setSpz] = useState(currentCar.spz);
  const [vin, setVIN] = useState(currentCar.vin);
  const params = useParams();

  const [erorrs, setErrors] = useState([0, 0, 0, 0]);

  function sendValues() {
    if (name.replaceAll(" ", "").length < 3) {
      setErrors([1, erorrs[1], erorrs[2], erorrs[3]]);
      return;
    }
    if (name.length > 256) {
      setErrors([2, erorrs[1], erorrs[2], erorrs[3]]);
      return;
    }

    if (year < 1885) {
      setErrors([erorrs[0], erorrs[1], erorrs[2], 1]);
      return;
    }
    if (year > new Date().getFullYear()) {
      setErrors([erorrs[0], erorrs[1], erorrs[2], 2]);
      return;
    }

    if (!SPZ_REGEXP.test(spz.replaceAll(" ", ""))) {
      setErrors([erorrs[0], erorrs[1], 1, erorrs[3]]);
    }

    if (!VIN_REGEXP.test(vin.replaceAll(" ", ""))) {
      setErrors([erorrs[0], 1, erorrs[2], erorrs[3]]);
    }

    axios
      .put(
        `https://showtime.app-dich.com/api/auto/cars/${params.id}${window.location.search}`,
        {
          name: name.replaceAll(" ", ""),
          vin: vin.replaceAll(" ", ""),
          spz: spz.replaceAll(" ", ""),
          releaseYear: Number(year),
        }
      )
      .then(async function (response) {
        let newData = carData;
        newData.name = name;
        newData.releaseYear = year;
        newData.spz = spz;
        newData.vin = vin;
        setCarData(newData);
        routeNavigator.hideModal();
      })
      .catch(function (error) {
        if (error.response.status == 409) {
          setErrors([erorrs[0], 2, 2, erorrs[3]]);
        }
      });
  }

  function onChangeName(e) {
    if (
      e.target.value.replaceAll(" ", "").length >= 3 &&
      e.target.value.length <= 256
    ) {
      setErrors([0, erorrs[1], erorrs[2], erorrs[3]]);
    }
    setName(e.target.value);
  }
  function onChangeYear(e) {
    if (e.target.value > 1800 && e.target.value <= new Date().getFullYear()) {
      setErrors([erorrs[0], erorrs[1], erorrs[2], 0]);
    }
    setYear(e.target.value);
  }
  function onChangeSpz(e) {
    if (SPZ_REGEXP.test(spz.replaceAll(" ", ""))) {
      setErrors([erorrs[0], erorrs[1], 0, erorrs[3]]);
    }
    setSpz(e.target.value.toUpperCase());
  }
  function onChangeVIN(e) {
    if (VIN_REGEXP.test(vin.replaceAll(" ", ""))) {
      setErrors([erorrs[0], 0, erorrs[2], erorrs[3]]);
    }
    setVIN(e.target.value.toUpperCase());
  }

  return (
    <ModalPage
      id="editCar"
      onClosed={() => routeNavigator.hideModal()}
      header={<ModalPageHeader>Редактирование</ModalPageHeader>}
    >
      <Group>
        <FormLayout>
          <FormLayoutGroup mode="vertical">
            <FormItem
              top="Название"
              status={erorrs[0] == 0 ? "default" : "error"}
              bottom={
                erorrs[0] == 0
                  ? false
                  : erorrs[0] == 1
                  ? "Не менее 3-х символов"
                  : "Не более 256 символов"
              }
            >
              <Input id="name" value={name} onChange={onChangeName} />
            </FormItem>
            <FormItem
              style={{ marginTop: -12 }}
              top="Год"
              status={erorrs[3] == 0 ? "default" : "error"}
              bottom={
                erorrs[3] == 0
                  ? false
                  : erorrs[3] == 1
                  ? "Не раньше 1885 года"
                  : "Не позже нынешнего года"
              }
            >
              <Input
                type="text"
                id="year"
                value={year}
                onChange={onChangeYear}
              />
            </FormItem>
            <FormItem
              style={{ marginTop: -12 }}
              top="Гос. номер"
              status={erorrs[2] == 0 ? "default" : "error"}
              bottom={checkSPZ(erorrs[2])}
            >
              <Input
                type="text"
                id="number"
                style={{ textTransform: "uppercase" }}
                value={spz}
                onChange={onChangeSpz}
              />
            </FormItem>
            <FormItem
              style={{ marginTop: -12 }}
              top="VIN"
              status={erorrs[1] == 0 ? "default" : "error"}
              bottom={checkVIN(erorrs[1])}
            >
              <Input type="text" id="VIN" value={vin} onChange={onChangeVIN} />
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
                sendValues();
              }}
              style={{
                borderRadius: 20,
              }}
              className="result-buttonGroup-retry"
              appearance="neutral"
              stretched
            >
              Сохранить
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
