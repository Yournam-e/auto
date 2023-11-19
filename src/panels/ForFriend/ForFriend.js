import {
  Icon28ArrowLeftOutline,
  Icon28CarOutline,
  Icon28DeleteOutline,
  Icon28ShareOutline,
  Icon28SpeedometerStartOutline,
  Icon28WrenchOutline,
} from "@vkontakte/icons";
import { useParams } from "@vkontakte/vk-mini-apps-router";
import {
  Button,
  ButtonGroup,
  Card,
  CardGrid,
  Div,
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
import { compare } from "../../utlis/functions";
import { FullMonths } from "../../utlis/months";
import "./ForFriend.css";

export const ForFriend = ({
  rt,
  routeNavigator,
  carId,
  setCurrentCar,
  carData,
  setCarData,
  setFriendView,
}) => {
  const params = useParams();

  const [photoUrl, setPhotoUrl] = useState();
  const [lastRepair, setLastRepair] = useState(null);

  useEffect(() => {
    setFriendView(true);
    if (!carData) {
      axios
        .get(
          `https://showtime.app-dich.com/api/auto/cars/preview/${params.guid}${window.location.search}`
        )
        .then(async function (response) {
          console.log(response.data);
          setCarData(response.data);
          setCurrentCar(response.data);
          setPhotoUrl(response.data.fileUrl);
        })
        .catch(function (error) {
          routeNavigator.replace("/notFound");
        });
    }
  }, []);

  useEffect(() => {
    if (carData && carData.repairs && carData.repairs.length) {
      const reps = carData.repairs;
      reps.sort(compare);
      const a = new Date(reps[0].created);
      setLastRepair(
        ` ${a.getFullYear()}, ${a.getDate()} ${FullMonths[a.getMonth()]}`
      );
    }
  }, [carData]);

  return (
    <Panel nav="add_panel">
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
        ></Image>
      </Div>

      <CardGrid size="m" style={{ marginTop: 18 }}>
        <Card mode="outline" style={{ borderRadius: 24, border: 121 }}>
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
                disabled={true}
              >
                Изменить
              </Button>
            </div>
          </div>
        </Card>
        <Card mode="outline" style={{ borderRadius: 24, border: 121 }}>
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
      <CardGrid size="l">
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
              Последнее обслуживание:{lastRepair ? " " + lastRepair : " пусто"}
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
            disabled={true}
          >
            Поделиться
          </Button>
          <Button
            size="l"
            appearance="neutral"
            before={<Icon28DeleteOutline />}
            stretched
            sizeY="regular"
            style={{ borderRadius: 12 }}
            disabled={true}
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
