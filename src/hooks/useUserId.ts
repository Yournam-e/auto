import { qsSign } from "./qs-sign";

export const useUserId = () => {
  const paramsString = qsSign.replace("?", "");
  const searchParams = new URLSearchParams(paramsString);

  return Number(searchParams.get("vk_user_id")!);
};
