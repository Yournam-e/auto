import { Icon16Done, Icon28CopyOutline } from "@vkontakte/icons";
import bridge from "@vkontakte/vk-bridge";
import { useParams } from "@vkontakte/vk-mini-apps-router";
import {
  Alert,
  Avatar,
  Button,
  ButtonGroup,
  Div,
  ModalPage,
  ModalPageHeader,
  Snackbar,
  Text,
  Title,
} from "@vkontakte/vkui";
import axios from "axios";
import { useEffect, useState } from "react";

export const Preview = ({
  carData,
  routeNavigator,
  setSnackbar,
  setPopout,
  platform,
}) => {
  const [link, setLink] = useState();
  const [erorrs, setErrors] = useState(0);

  const closePopout = () => {
    setPopout(null);
  };

  useEffect(() => {
    console.log(erorrs);
  }, [erorrs]);

  async function replaceOwner(newVkUserId) {
    axios
      .post(
        `https://showtime.app-dich.com/api/auto/cars/${params.carId}/ownership${window.location.search}`,
        { newVkUserId: newVkUserId }
      )
      .then(async function (response) {
        routeNavigator.hidePopout();
        routeNavigator.replace("/");
      })
      .catch(function (error) {
        console.warn(error);
      });
  }

  async function sendValues() {
    axios
      .post(
        `https://showtime.app-dich.com/api/auto/cars/${params.carId}/preview${window.location.search}`
      )
      .then(async function (response) {
        console.log(response.data);
        setLink(response.data.carGuid);
      })
      .catch(function (error) {
        console.warn(error);
      });
  }

  async function getFriends() {
    bridge
      .send("VKWebAppGetFriends")
      .then((data) => {
        if (data) {
          routeNavigator.showPopout(
            <Alert
              actions={[
                {
                  title: "Передать авто",
                  mode: "destructive",
                  autoClose: true,
                  action: () => {
                    replaceOwner(data.users[0].id);
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
              text="Вы уверены, что хотите передать авто? После передачи вы не сможете его вернуть"
            />
          );
        }
      })
      .catch((error) => {
        // Ошибка
        console.log(error);
      });
  }

  async function copyText() {
    setSnackbar(
      <Snackbar
        onClose={() => setSnackbar(null)}
        onActionClick={() => "Добавляем метку."}
        before={
          <Avatar
            size={24}
            style={{ background: "var(--vkui--color_background_accent)" }}
          >
            <Icon16Done fill="#fff" width={14} height={14} />
          </Avatar>
        }
      >
        Ссылка скопирована
      </Snackbar>
    );
    bridge
      .send("VKWebAppCopyText", {
        text: `https://vk.com/app51759788#/preview/${link}`,
      })
      .then((data) => {
        if (data.result) {
          // Текст скопирован в буфер обмена
        } else {
          // Ошибка
        }
      })
      .catch((error) => {
        // Ошибка
        console.log(error);
      });
  }
  const params = useParams();

  useEffect(() => {
    sendValues();
  }, []);

  return (
    <ModalPage
      id="previewCar"
      onClosed={() => {
        routeNavigator.replace(`/`);
      }}
      header={
        <ModalPageHeader style={{ textAlign: "center" }}>
          Доступ к авто
        </ModalPageHeader>
      }
    >
      <Div>
        <Title level="2">Ссылка для просмотра</Title>
        <Text style={{ marginTop: 4 }}>
          После первого открытия ссылки, повторный просмотр будет
          недействительным
        </Text>
        <ButtonGroup stretched={true} style={{ marginTop: 4 }}>
          <Button
            size="l"
            stretched={true}
            align="left"
            style={{ borderRadius: 12 }}
            appearance="appearance"
            mode="primary"
            onClick={() => {
              copyText();
            }}
            after={<Icon28CopyOutline fill="#B8C1CC" />}
          >
            https://vk.com/app51759788#/preview/{link}
          </Button>
        </ButtonGroup>
      </Div>
      {platform !== "mobile-web" && (
        <Div>
          <Title level="2">Передать владельца авто</Title>
          <Text style={{ marginTop: 4 }}>
            Вы можете передать права к авто другому пользователю (при этом у вас
            не будет прав просмотра или редактирования)
          </Text>
          <ButtonGroup stretched={true} style={{ marginTop: 4 }}>
            <Button
              size="l"
              stretched={true}
              align="center"
              appearance="appearance"
              onClick={() => {
                getFriends();
              }}
            >
              Передать владельца авто
            </Button>
          </ButtonGroup>
        </Div>
      )}
    </ModalPage>
  );
};
