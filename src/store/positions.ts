import { defineStore } from "pinia";
import { reactive, Reactive } from "vue";
import { IPosition } from "@/types/backend-interfaces/position";

export const usePositionsStore = defineStore("positions", () => {
  const positions: Reactive<IPosition[]> = reactive([
    {
      id: 1,
      created_at: "03.07.2024",
      name: "Vue Engineer",
    },
    {
      id: 2,
      created_at: "03.07.2024",
      name: "Cloud Engineer",
    },
    {
      id: 3,
      created_at: "03.07.2024",
      name: "Data Analyst",
    },
    {
      id: 4,
      created_at: "03.07.2024",
      name: "Data Architect",
    },
    {
      id: 5,
      created_at: "03.07.2024",
      name: "Database Administrator",
    },
    {
      id: 6,
      created_at: "03.07.2024",
      name: "DevOps Engineer",
    },
    {
      id: 7,
      created_at: "03.07.2024",
      name: "Network Engineer",
    },
    {
      id: 8,
      created_at: "03.07.2024",
      name: "Project Manager",
    },
    {
      id: 9,
      created_at: "03.07.2024",
      name: "QA Engineer",
    },
    {
      id: 10,
      created_at: "03.07.2024",
      name: "Software Engineer",
    },
    {
      id: 11,
      created_at: "03.07.2024",
      name: "Support Specialist",
    },
    {
      id: 12,
      created_at: "03.07.2024",
      name: "Systems Analyst",
    },
    {
      id: 13,
      created_at: "03.07.2024",
      name: "UX Designer",
    },
  ]);

  async function getPositionById(
    targetId: number
  ): Promise<IPosition | undefined> {
    // if (positions === null) { await Подтягиваем позиции с сервера ... }
    return positions.find((pos) => pos.id === targetId);
  }

  return { positions, getPositionById };
});
