import { defineStore } from "pinia";
import { reactive, Reactive } from "vue";
import { IUser, UserRole } from "@/types/backend-interfaces/user";
import { Mastery } from "@/types/backend-interfaces/skill/mastery";

export const useUsersStore = defineStore("users", () => {
  const users: Reactive<IUser[]> = reactive([
    {
      id: 1,
      created_at: "03.07.2024",
      email: "pavel.zhukouski@innowise.com",
      is_verified: true,
      profile: {
        id: 1,
        created_at: "03.07.2024",
        first_name: "Pavel",
        last_name: "Zhukouski",
        full_name: "Pavel Zhukouski",
        avatar: "employee-1.png",
        skills: [
          {
            name: "MySQL",
            category: "Database management system",
            mastery: Mastery.Novice,
          },
          {
            name: "HTML/CSS",
            category: "Programming technologies",
            mastery: Mastery.Proficient,
          },
          {
            name: "JavaScript",
            category: "Programming technologies",
            mastery: Mastery.Expert,
          },
          {
            name: "React",
            category: "Programming technologies",
            mastery: Mastery.Advanced,
          },
          {
            name: "Vue",
            category: "Programming technologies",
            mastery: Mastery.Proficient,
          },
          {
            name: "Git",
            category: "Source control systems",
            mastery: Mastery.Competent,
          },
          {
            name: "Playing computer games",
            category: undefined,
            mastery: Mastery.Expert,
          },
          {
            name: "Drawing",
            category: undefined,
            mastery: Mastery.Advanced,
          },
        ],
        languages: [],
      },
      cvs: undefined,
      department: undefined,
      department_name: "Vue",
      position: undefined,
      position_name: "Vue Engineer",
      role: UserRole.Employee,
    },
    {
      id: 2,
      created_at: "03.07.2024",
      email: "aliaksei.yuryeu@innowise.com",
      is_verified: true,
      profile: {
        id: 2,
        created_at: "03.07.2024",
        first_name: "Aliaksei",
        last_name: "Yuryeu",
        full_name: "Aliaksei Yuryeu",
        avatar: "employee-2.png",
        skills: [],
        languages: [],
      },
      cvs: undefined,
      department: undefined,
      department_name: "Vue",
      position: undefined,
      position_name: "Vue Engineer",
      role: UserRole.Employee,
    },
  ]);

  async function getUserById(targetId: number): Promise<IUser | undefined> {
    // if (users === null) { await Подтягиваем юзеров с сервера ... }
    return users.find((user) => user.id === targetId);
  }

  return { users, getUserById };
});
