import { Icon28AddOutline } from "@vkontakte/icons";
import {
  Button,
  ButtonGroup,
  CellButton,
  File,
  FormItem,
  FormLayout,
  FormLayoutGroup,
  Group,
  Image,
  Input,
  Panel,
  PanelHeader,
  Text,
  Title,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import axios from "axios";
import { useState } from "react";
import { checkPhoto, checkSPZ, checkVIN } from "../../utlis/functions";
import { SPZ_REGEXP, VIN_REGEXP } from "../../utlis/regExp";
import "./AddCar.css";

export const AddCar = ({ rt, platform, appearance }) => {
  const [name, setName] = useState("");
  const [year, setYear] = useState(2023);
  const [spz, setSpz] = useState("");
  const [vin, setVIN] = useState("");
  const [photoUrl, setPhotoUrl] = useState();
  const [photoId, setPhotoId] = useState();

  const [erorrs, setErrors] = useState([0, 0, 0, 0]);
  const [photoError, setPhotoError] = useState(0);

  const fileUploadOnDrop = async (e) => {
    const formData = new FormData();
    formData.append("filename", "fileName");
    setPhotoError(0);

    if (e.target.files[0] && e.target.files[0].size > 10485760) {
      setPhotoError(1);
      return;
    }

    const fileType = e.target.files[0].type;
    if (!checkPhoto(fileType)) {
      setPhotoError(2);
      return;
    }

    formData.append("file", e.target.files[0]);

    await axios
      .post(
        `https://showtime.app-dich.com/api/filestorage/auto${window.location.search}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(async function (response) {
        setPhotoUrl(`https://showtime.app-dich.com/` + response.data.data.url);
        setPhotoId(response.data.data.id);
      })
      .catch(function (error) {
        console.warn(error);
      });
  };

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
    if (e.target.value > 1885 && e.target.value <= new Date().getFullYear()) {
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
      .post(
        `https://showtime.app-dich.com/api/auto/cars${window.location.search}`,
        {
          name: name,
          vin: vin.replaceAll(" ", ""),
          spz: spz.replaceAll(" ", ""),
          releaseYear: Number(year),
          fileId: photoId,
        }
      )
      .then(async function (response) {
        rt.push("/");
      })
      .catch(function (error) {
        if (error.response.status == 409) {
          setErrors([erorrs[0], 2, 2, erorrs[3]]);
        }
      });
  }

  return (
    <Panel
      nav="add_panel"
      style={{
        overflow: "hidden",
        display: "flex",
        background: appearance == "light" ? "#FFFFFF" : "#222222",
      }}
    >
      <PanelHeader style={{ textAlign: "center" }} separator={false}>
        Новое авто
      </PanelHeader>

      <Group className="inputsGroup">
        <FormLayout>
          <FormItem
            status={photoError == 0 ? "default" : "error"}
            bottom={
              photoError == 0
                ? false
                : photoError == 1
                ? "Не больше 10Мб"
                : "Только в формате .jpg, .jpeg, .png, .gif, .webp"
            }
          >
            <CellButton
              multiline={true}
              before={
                <Image src={photoUrl} withBorder={false} size={56}>
                  {!photoUrl && (
                    <Icon28AddOutline style={{ position: "absolute" }} />
                  )}
                  <File
                    style={{
                      backgroundColor: "#ffffff00",
                      margin: "auto",
                      width: 56,
                      height: 56,
                      color: "#ffffff00",
                    }}
                    onChange={(e) => {
                      fileUploadOnDrop(e);
                    }}
                    accept=".jpg,.jpeg,.png,.gif,.webp"
                  ></File>
                </Image>
              }
            >
              <Title
                style={{
                  color: appearance == "light" ? "#000000" : "#FFFFFF",
                }}
                level="2"
              >
                Фото
              </Title>
              <Text
                style={{ color: appearance == "light" ? "#000000" : "#FFFFFF" }}
              >
                {photoUrl
                  ? "Нажмите для того чтобы изменить фотографию машины"
                  : "Вы можете загрузить фотографию машины"}
              </Text>
            </CellButton>
          </FormItem>
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
                type="number"
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
              stretched={true}
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
              }}
              appearance="neutral"
              mode="tertiary"
              onClick={() => {
                rt.push("/");
              }}
              stretched
            >
              Отменить
            </Button>
          </div>
        </ButtonGroup>
      </Group>
    </Panel>
  );
};
