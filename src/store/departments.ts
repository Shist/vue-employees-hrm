import { defineStore } from "pinia";
import { reactive, Reactive } from "vue";
import { IDepartment } from "@/types/backend-interfaces/department";

export const useDepartmentsStore = defineStore("departments", () => {
  const departments: Reactive<IDepartment[]> = reactive([
    {
      id: 1,
      created_at: "03.07.2024",
      name: "Vue",
    },
    {
      id: 2,
      created_at: "03.07.2024",
      name: "Blockchain",
    },
    {
      id: 3,
      created_at: "03.07.2024",
      name: "DevOps",
    },
    {
      id: 4,
      created_at: "03.07.2024",
      name: "Global",
    },
    {
      id: 5,
      created_at: "03.07.2024",
      name: "Java",
    },
    {
      id: 6,
      created_at: "03.07.2024",
      name: "Node",
    },
    {
      id: 7,
      created_at: "03.07.2024",
      name: "Python",
    },
    {
      id: 8,
      created_at: "03.07.2024",
      name: "Quality Assurance",
    },
    {
      id: 9,
      created_at: "03.07.2024",
      name: "React",
    },
  ]);

  async function getDepartmentById(
    targetId: number
  ): Promise<IDepartment | undefined> {
    // if (departments === null) { await Подтягиваем департменты с сервера ... }
    return departments.find((dep) => dep.id === targetId);
  }

  return { departments, getDepartmentById };
});
