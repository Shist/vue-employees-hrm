export default function handleCategoryNames(categoryName: string | null) {
  if (
    categoryName === "Programmiersprachen" ||
    categoryName === "Языки программирования" ||
    categoryName === "Programming languages"
  ) {
    return "Programming languages";
  } else if (
    categoryName === "Programmiertechnologien" ||
    categoryName === "Технологии разработки" ||
    categoryName === "Programming technologies"
  ) {
    return "Programming technologies";
  } else if (
    categoryName === "Quellcodeverwaltungssysteme" ||
    categoryName === "Системы контроля версий" ||
    categoryName === "Source control systems"
  ) {
    return "Source control systems";
  } else if (
    categoryName === "Datenbankverwaltungssystem" ||
    categoryName === "Система управления базами данных" ||
    categoryName === "Database management system"
  ) {
    return "Database management system";
  } else {
    return "Other skills";
  }
}
