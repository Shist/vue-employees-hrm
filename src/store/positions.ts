import { defineStore } from "pinia";
import { reactive, Reactive } from "vue";
import { IPositionData } from "@/types/positionData";

export const usePositionsStore = defineStore("positions", () => {
  const positions: Reactive<IPositionData[]> = reactive([
    {
      id: 1,
      name: "AQA Engineer",
    },
    {
      id: 2,
      name: "Cloud Engineer",
    },
    {
      id: 3,
      name: "Data Analyst",
    },
    {
      id: 4,
      name: "Data Architect",
    },
    {
      id: 5,
      name: "Database Administrator",
    },
    {
      id: 6,
      name: "DevOps Engineer",
    },
    {
      id: 7,
      name: "Network Engineer",
    },
    {
      id: 8,
      name: "Project Manager",
    },
    {
      id: 9,
      name: "QA Engineer",
    },
    {
      id: 10,
      name: "Software Engineer",
    },
    {
      id: 11,
      name: "Support Specialist",
    },
    {
      id: 12,
      name: "Systems Analyst",
    },
    {
      id: 13,
      name: "UX Designer",
    },
  ]);

  async function getPositionById(targetId: number) {
    // if (positions === null) { await Подтягиваем позиции с сервера ... }
    return positions.find((pos) => pos.id === targetId);
  }

  return { positions, getPositionById };
});
