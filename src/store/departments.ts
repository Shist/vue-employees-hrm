import { defineStore } from "pinia";
import { reactive, Reactive } from "vue";
import IDepartmentData from "@/types/IDepartmentData";

export const useDepartmentsStore = defineStore("departments", () => {
  const departments: Reactive<IDepartmentData[]> = reactive([
    {
      id: 1,
      name: ".Net",
    },
    {
      id: 2,
      name: "Blockchain",
    },
    {
      id: 3,
      name: "DevOps",
    },
    {
      id: 4,
      name: "Global",
    },
    {
      id: 5,
      name: "Java",
    },
    {
      id: 6,
      name: "Node",
    },
    {
      id: 7,
      name: "Python",
    },
    {
      id: 8,
      name: "Quality Assurance",
    },
    {
      id: 9,
      name: "React",
    },
  ]);

  async function getDepartmentById(targetId: number) {
    // if (departments === null) { await Подтягиваем департменты с сервера ... }
    return departments.find((dep) => dep.id === targetId);
  }

  return { departments, getDepartmentById };
});
