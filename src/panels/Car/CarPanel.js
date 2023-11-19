import {
  Icon28AddOutline,
  Icon28ArrowLeftOutline,
  Icon28CarOutline,
  Icon28DeleteOutline,
  Icon28ShareOutline,
  Icon28SpeedometerStartOutline,
  Icon28WrenchOutline,
} from "@vkontakte/icons";
import { useParams } from "@vkontakte/vk-mini-apps-router";
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  CardGrid,
  Div,
  File,
  Image,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Text,
  Title,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { checkPhoto, compare } from "../../utlis/functions";
import { FullMonths } from "../../utlis/months";
import "./CarPanel.css";

export const CarPanel = ({
  rt,
  routeNavigator,
  carId,
  setPopout,
  setCurrentCar,
  carData,
  setCarData,
  setFriendView,
  appearance,
  photoUrl,
  setPhotoUrl,
  itFriendView,
}) => {
  const params = useParams();

  const [lastRepair, setLastRepair] = useState(null);

  const [photoError, setPhotoError] = useState(0);

  function sendValues(photoId) {
    axios
      .put(
        `https://showtime.app-dich.com/api/auto/cars/${params.id}${window.location.search}`,
        {
          name: carData.name,
          vin: carData.vin,
          spz: carData.spz,
          releaseYear: carData.releaseYear,
          fileId: photoId,
        }
      )
      .then(async function (response) {
        console.log("ok");
      })
      .catch(function (error) {
        console.warn(error);
      });
  }

  const fileUploadOnDrop = async (e) => {
    const formData = new FormData();
    formData.append("filename", "fileName");
    formData.append("file", e.target.files[0]);

    setPhotoError(0);
    if (e.target.files[0] && e.target.files[0].size > 10485760) {
      rt.showPopout(
        <Alert
          actions={[
            {
              title: "Ок",
              mode: "destructive",
              autoClose: true,
              action: () => setPopout(null),
            },
          ]}
          actionsLayout="vertical"
          onClose={() => routeNavigator.hidePopout()}
          header="Внимание"
          text="Размер фото не должен привышать 10мб"
        />
      );
      return;
    }
    const fileType = e.target.files[0].type;
    if (!checkPhoto(fileType)) {
      rt.showPopout(
        <Alert
          actions={[
            {
              title: "Ок",
              mode: "destructive",
              autoClose: true,
              action: () => setPopout(null),
            },
          ]}
          actionsLayout="vertical"
          onClose={() => routeNavigator.hidePopout()}
          header="Внимание"
          text="Файл дожен быть в одном из следующих форматов: .jpg, .jpeg, .png, .gif, .webp"
        />
      );
      return;
    }

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
        setPhotoUrl(response.data.data.url);
        sendValues(response.data.data.id);
      })
      .catch(function (error) {
        console.warn(error);
      });
  };

  useEffect(() => {
    if (carData && carData.repairs && carData.repairs.length) {
      console.log(carData);
      const reps = carData.repairs;
      console.log(carData.repairs);
      reps.sort(compare);
      const a = new Date(reps[0].created);
      setLastRepair(
        ` ${a.getFullYear()}, ${a.getDate()} ${FullMonths[a.getMonth()]}`
      );
    }
  }, [carData]);

  useEffect(() => {
    setFriendView(false);
    axios
      .get(
        `https://showtime.app-dich.com/api/auto/cars/${params.id}${window.location.search}`
      )
      .then(async function (response) {
        setCarData(response.data);
        setPopout(null);
        setCurrentCar(response.data);
        if (itFriendView && photoUrl) {
          return;
        }
        setPhotoUrl(response.data.fileUrl);
      })
      .catch(function (error) {
        console.log("response.data.fileUrl");
        routeNavigator.replace("/notFound");
        setPopout(null);
      });

    console.log("response.data.fileUrl");
  }, []);

  useEffect(() => {
    console.log(photoUrl);
  }, [photoUrl]);

  function deleteCar() {
    axios
      .delete(
        `https://showtime.app-dich.com/api/auto/cars/${params.id}${window.location.search}`
      )
      .then(async function (response) {
        rt.push("/");
      })
      .catch(function (error) {
        console.warn(error);
      });
  }

  return (
    <Panel
      nav="add_panel"
      style={{ background: appearance == "light" ? "#FFFFFF" : "#222222" }}
    >
      <PanelHeader
        separator={false}
        before={
          <PanelHeaderButton
            onClick={() => {
              rt.push("/");
            }}
          >
            <Icon28ArrowLeftOutline />
          </PanelHeaderButton>
        }
      >
        Информация
      </PanelHeader>

      <Div>
        <Image
          withBorder={false}
          className="asdsdfsdfsadasdasd"
          size={120}
          borderRadius="l"
          src={photoUrl && "https://showtime.app-dich.com/" + photoUrl}
        >
          {!photoUrl && <Icon28AddOutline style={{ position: "absolute" }} />}
          <File
            style={{
              backgroundColor: "#ffffff00",
              margin: "auto",
              width: 120,
              height: 120,
              color: "#ffffff00",
            }}
            accept=".jpg,.jpeg,.png,.gif,.webp"
            onChange={(e) => {
              fileUploadOnDrop(e);
            }}
          ></File>
        </Image>
      </Div>

      <CardGrid
        size="m"
        style={{ marginTop: 18, marginRight: 12, marginLeft: 12 }}
      >
        <Card mode="outline" style={{ borderRadius: 24 }}>
          <div>
            <Icon28CarOutline
              style={{ marginLeft: "14px", marginTop: "14px" }}
            />
            <div style={{ margin: 14 }}>
              <Title
                level="1"
                className="car-card-title"
                style={{ width: "120px" }}
              >
                {carData && carData.name}, {carData && carData.releaseYear}
              </Title>

              <Text
                style={{ paddingTop: 4 }}
                className="lvl-card-parametr-text"
              >
                {carData && carData.spz}
              </Text>
              <Button
                style={{ marginTop: 16, borderRadius: 24 }}
                appearance="neutral"
                stretched
                size="m"
                onClick={() => {
                  routeNavigator.showModal("editCar");
                }}
              >
                Изменить
              </Button>
            </div>
          </div>
        </Card>
        <Card
          mode="outline"
          style={{ borderRadius: 24, border: 121 }}
          className="sedgsdsdg1324124"
        >
          <div>
            <Icon28SpeedometerStartOutline
              style={{ marginLeft: "14px", marginTop: "14px" }}
            />
            <div
              style={{
                marginTop: 14,
                marginRight: 14,
                marginLeft: 14,
                paddingBottom: 14,
              }}
            >
              <Title
                level="1"
                className="car-card-title"
                style={{ width: "120px" }}
              >
                Пробег
              </Title>

              <Text
                style={{ paddingTop: 4 }}
                className="lvl-card-parametr-text"
              >
                {carData
                  ? carData.mileages
                    ? carData.mileages.length
                      ? Math.max(...carData.mileages.map((o) => o.mileage)) +
                        "км"
                      : "пусто"
                    : "пусто"
                  : "пусто"}
              </Text>
              <Button
                style={{ marginTop: 16, borderRadius: 24 }}
                appearance="neutral"
                stretched
                size="m"
                onClick={() => {
                  rt.push(`/carPanel/${params.id}/mileages`);
                }}
              >
                Подробнее
              </Button>
            </div>
          </div>
        </Card>
      </CardGrid>
      <CardGrid size="l" style={{ marginRight: 12, marginLeft: 12 }}>
        <Card mode="outline" style={{ borderRadius: 24 }}>
          <div style={{ margin: 14 }}>
            <Icon28WrenchOutline />
            <Title
              level="1"
              className="car-card-title"
              style={{
                width: "120px",
                paddingTop: 8,
              }}
            >
              Ремонты
            </Title>

            <Text style={{ paddingTop: 4 }} className="lvl-card-parametr-text">
              Последнее обслуживание:
              {lastRepair ? " " + lastRepair : " пусто"}
            </Text>
          </div>

          <div style={{ margin: 16 }}>
            <Button
              style={{ padding: 4, borderRadius: 24 }}
              appearance="neutral"
              stretched
              size="l"
              sizeY="regular"
              onClick={() => {
                rt.push(`/carPanel/${params.id}/repairs`);
              }}
            >
              Подробнее
            </Button>
          </div>
        </Card>
      </CardGrid>

      <div style={{ marginTop: 12, marginRight: 26, marginLeft: 26 }}>
        <ButtonGroup mode="horizontal" gap="m" stretched>
          <Button
            size="l"
            appearance="neutral"
            before={<Icon28ShareOutline />}
            stretched
            onClick={() => {
              rt.push(`/carPanel/${params.id}/preview`);
            }}
            style={{ borderRadius: 12 }}
            sizeY="regular"
          >
            Поделиться
          </Button>
          <Button
            size="l"
            appearance="neutral"
            before={<Icon28DeleteOutline />}
            stretched
            sizeY="regular"
            onClick={() => {
              rt.showPopout(
                <Alert
                  actions={[
                    {
                      title: "Удалить",
                      mode: "destructive",
                      autoClose: true,
                      action: () => {
                        deleteCar();
                      },
                    },
                    {
                      title: "Отмена",
                      autoClose: true,
                      mode: "cancel",
                    },
                  ]}
                  actionsLayout="vertical"
                  onClose={() => routeNavigator.hidePopout()}
                  header="Подтвердите действие"
                  text="Вы уверены, что хотите удалить авто?"
                />
              );
            }}
            style={{ borderRadius: 12 }}
          >
            Удалить
          </Button>
        </ButtonGroup>
      </div>
      {carData && (
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <Text style={{ color: "#5A5A5A" }}>VIN: {carData.vin}</Text>
        </div>
      )}
    </Panel>
  );
};
