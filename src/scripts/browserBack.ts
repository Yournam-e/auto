import { back } from "@blumjs/router";

export const browserBack = () => {
  back({ isBackFromBrowser: true });
};
