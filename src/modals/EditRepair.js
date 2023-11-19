import { useParams } from "@vkontakte/vk-mini-apps-router";
import {
  Button,
  ButtonGroup,
  DateInput,
  FormItem,
  FormLayout,
  FormLayoutGroup,
  Group,
  Input,
  LocaleProvider,
  ModalPage,
  ModalPageHeader,
  Textarea,
} from "@vkontakte/vkui";
import axios from "axios";
import { useEffect, useState } from "react";
import { checkAmountSpent } from "../utlis/functions";

export const EditReapair = ({
  currentCar,
  setRepairsInfo,
  reapairsInfo,
  carData,
  routeNavigator,
}) => {
  const params = useParams();
  const [shortTitle, setShortTitle] = useState();
  const [date, setDate] = useState(() => new Date());
  const [description, setDescription] = useState();
  const [amountSpent, setAmountSpent] = useState(0);
  const [load, setLoad] = useState(false);

  const [erorrs, setErrors] = useState([0, 0, 0, 0]);

  useEffect(() => {
    if (reapairsInfo) {
      setShortTitle(
        reapairsInfo
          ? reapairsInfo.find((element) => element.id == Number(params.repId))
              .title
          : ""
      );
      setDescription(
        reapairsInfo.find((element) => element.id == Number(params.repId))
          .description
      );

      setAmountSpent(
        reapairsInfo.find((element) => element.id == Number(params.repId))
          .repairValue
      );

      console.log(
        reapairsInfo.find(
          (element) => element.id == Number(params.repId).created
        )
      );

      setDate(
        new Date(
          reapairsInfo.find(
            (element) => element.id == Number(params.repId)
          ).created
        )
      );
    }
  }, []);

  useEffect(() => {
    console.log(reapairsInfo);
  }, [reapairsInfo]);

  function editReapair() {
    if (!shortTitle || shortTitle.replaceAll(" ", "").length < 3) {
      setErrors([1, erorrs[1], erorrs[2], erorrs[3]]);
      return;
    }

    if (shortTitle.length > 256) {
      setErrors([2, erorrs[1], erorrs[2], erorrs[3]]);
      return;
    }

    if (description && description.length > 2048) {
      setErrors([erorrs[0], 2, erorrs[2], erorrs[3]]);
      return;
    }

    if (
      description &&
      description.replaceAll(" ", "").length != 0 &&
      description.replaceAll(" ", "").length < 3
    ) {
      setErrors([erorrs[0], 1, erorrs[2], erorrs[3]]);
      return;
    }

    if (Number(amountSpent) < 0) {
      setErrors([erorrs[0], erorrs[1], 1, erorrs[3]]);
      return;
    }
    if (Number(amountSpent) > 1000000000) {
      setErrors([erorrs[0], erorrs[1], 2, erorrs[3]]);
      return;
    }

    if (!Number.isInteger(Number(amountSpent))) {
      setErrors([erorrs[0], erorrs[1], 3, erorrs[3]]);
      return;
    }

    if (date > new Date()) {
      setErrors([erorrs[0], erorrs[1], erorrs[2], 1]);
      return;
    }

    const newItem = {
      id: Number(params.repId),
      title: shortTitle,
      repairValue: Number(amountSpent),
      created: date,
    };

    if (description && description.replaceAll(" ", "").length != 0) {
      newItem.description = description;
    }
    axios
      .put(
        `https://showtime.app-dich.com/api/auto/cars/${params.id}/repairs/${params.repId}${window.location.search}`,
        newItem
      )
      .then(async function (response) {
        setRepairsInfo([
          ...reapairsInfo.map((item) =>
            item.id === Number(params.repId) ? { ...newItem } : { ...item }
          ),
        ]);
        routeNavigator.hideModal();
      })
      .catch(function (error) {
        console.warn(error);
      });
  }

  function onChangeDate(e) {
    const limit = new Date(1970, 0, 1);
    const autoReleaseYear = carData
      ? new Date(carData.releaseYear, 0, 1)
      : limit;
    const minDate = limit >= autoReleaseYear ? limit : autoReleaseYear;

    if (e < minDate) {
      setDate(minDate);
      return;
    }
    setDate(e);
  }

  function onChangeShortTitle(e) {
    if (
      e.target.value.replaceAll(" ", "").length >= 3 &&
      e.target.value.length <= 256
    ) {
      setErrors([0, erorrs[1], erorrs[2], erorrs[3]]);
    }
    setShortTitle(e.target.value);
  }
  function onChangeDescription(e) {
    if (
      (e.target.value.length >= 3 && e.target.value.length <= 2048) ||
      e.target.value.replaceAll(" ", "").length == 0
    ) {
      setErrors([erorrs[0], 0, erorrs[2], erorrs[3]]);
    }
    setDescription(e.target.value);
  }
  function onChangeAmountSpent(e) {
    if (
      Number(e.target.value) >= 0 &&
      Number(e.target.value) <= 1000000000 &&
      Number.isInteger(Number(amountSpent))
    ) {
      setErrors([erorrs[0], erorrs[1], 0, erorrs[3]]);
    }
    if (Number(e.target.value) > 1000000000) {
      setAmountSpent(1000000000);
      return;
    }
    setAmountSpent(e.target.value);
  }

  return (
    <ModalPage
      id="editReapair"
      onClosed={() => {
        routeNavigator.hideModal();
      }}
      header={<ModalPageHeader>Изменение записи</ModalPageHeader>}
    >
      <Group>
        <FormLayout>
          <FormLayoutGroup mode="vertical">
            <FormItem
              top="Краткая информация"
              status={erorrs[0] == 0 ? "default" : "error"}
              bottom={
                erorrs[0] == 0
                  ? false
                  : erorrs[0] == 1
                  ? "Не менее 3-х символов"
                  : "Не более 256 символов"
              }
            >
              <Input
                id="name"
                value={shortTitle}
                onChange={onChangeShortTitle}
              />
            </FormItem>
            <FormItem
              style={{ marginTop: -12 }}
              top="Подробная информация (необязательно)"
              status={erorrs[1] == 0 ? "default" : "error"}
              bottom={
                erorrs[1] == 0
                  ? false
                  : erorrs[1] == 1
                  ? "Не менее 3-х символов"
                  : "Не более 2048 символов"
              }
            >
              <Textarea
                type="text"
                id="shortTitle"
                style={{ textTransform: "uppercase" }}
                value={description}
                onChange={onChangeDescription}
              />
            </FormItem>
            <FormItem
              style={{ marginTop: -12 }}
              top="Потраченная сумма (необязательно)"
              status={erorrs[2] == 0 ? "default" : "error"}
              bottom={checkAmountSpent(erorrs[2])}
            >
              <Input
                type="number"
                id="amountSpent"
                value={amountSpent}
                onChange={onChangeAmountSpent}
              />
            </FormItem>
            <LocaleProvider value={"ru"}>
              <FormItem
                top="Дата события"
                status={erorrs[3] == 0 ? "default" : "error"}
                bottom={erorrs[3] == 0 ? false : "Не позже сегодняшнего дня"}
              >
                <DateInput
                  value={date}
                  onChange={onChangeDate}
                  disableFuture={true}
                />
              </FormItem>
            </LocaleProvider>
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
                editReapair();
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
