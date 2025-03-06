import { fetchCurrentUserLanguage } from "@/features/profile/api/save-profile-settings";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  let language = await fetchCurrentUserLanguage();
  const locale = "en";

  return {
    locale,
    messages: (await import(`./../messages/${language?.toLowerCase()}.json`))
      .default,
  };
});
