import bridge from "@vkontakte/vk-bridge";
import { onBoard1 } from "../img/onBoard1";
import { onBoard2 } from "../img/onBoard2";
import { onBoard3 } from "../img/onBoard3";

export async function checkOnboard() {
  const isShowOnboard =
    (await bridge.send("VKWebAppStorageGet", { keys: ["onBoard"] })).keys[0]
      .value === "";
  if (isShowOnboard) {
    bridge
      .send("VKWebAppShowSlidesSheet", {
        slides: [
          {
            media: {
              blob: `data:image/png;base64,${onBoard1}`,
              type: "image",
            },
            title: "Привет!",
            subtitle:
              "«Моё авто» поможет вести учет событий связанных с автомобилем.",
          },
          {
            media: {
              blob: `data:image/png;base64,${onBoard2}`,
              type: "image",
            },
            title: "Зачем это нужно?!",
            subtitle: "Самое главное в авто – вовремя проследить и сделать ТО.",
          },
          {
            media: {
              blob: `data:image/png;base64,${onBoard3}`,
              type: "image",
            },
            title: "Какие задачи поставлены?",
            subtitle:
              "Записывай пробег и обслуживание. При необходимости можешь показать карточку авто другому человеку.",
          },
        ],
      })
      .then(async (data) => {
        if (data.result) {
          bridge.send("VKWebAppStorageSet", {
            key: `onBoard`,
            value: "1",
          });
        }
      })
      .catch((error) => {
        // Ошибка
        console.log(error);
      });
  }
}
