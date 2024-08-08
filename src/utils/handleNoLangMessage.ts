import getUserLocale from "@/utils/getUserLocale";

export function handleUnauthorizedMessage() {
  const locale = getUserLocale();

  if (locale === "ru") {
    return "Неавторизованный доступ";
  } else if (locale === "de") {
    return "Nicht autorisiert";
  } else {
    return "Unauthorized";
  }
}

export function handleLangLoadErrorMessage() {
  const locale = getUserLocale();

  if (locale === "ru") {
    return "Не удалось загрузить русскоязычные ресурсы";
  } else if (locale === "de") {
    return "Fehler beim Laden der deutschsprachigen Ressourcen";
  } else {
    return "Failed to load english language resources";
  }
}
