import { defineStore } from "pinia";
import { reactive, Reactive } from "vue";
import IUserData from "@/types/IUserData";
import { Mastery } from "@/types/ISkillMastery";

export const useUsersStore = defineStore("users", () => {
  const users: Reactive<IUserData[]> = reactive([
    {
      id: 1,
      avatar: "employee-1.png",
      firstName: "Pavel",
      lastName: "Zhukouski",
      email: "pavel.zhukouski@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
      skills: [
        {
          id: 5,
          name: "MySQL",
          category: "Database management system",
          mastery: Mastery.Novice,
        },
        {
          id: 6,
          name: "HTML/CSS",
          category: "Programming technologies",
          mastery: Mastery.Proficient,
        },
        {
          id: 1,
          name: "JavaScript",
          category: "Programming technologies",
          mastery: Mastery.Expert,
        },
        {
          id: 7,
          name: "React",
          category: "Programming technologies",
          mastery: Mastery.Advanced,
        },
        {
          id: 3,
          name: "Vue",
          category: "Programming technologies",
          mastery: Mastery.Proficient,
        },
        {
          id: 8,
          name: "Git",
          category: "Source control systems",
          mastery: Mastery.Completent,
        },
      ],
    },
    {
      id: 2,
      avatar: "employee-2.png",
      firstName: "Aliaksei",
      lastName: "Yuryeu",
      email: "aliaksei.yuryeu@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
      skills: [],
    },
    {
      id: 3,
      avatar: "employee-1.png",
      firstName: "Pavel",
      lastName: "Zhukouski",
      email: "pavel.zhukouski@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
      skills: [],
    },
    {
      id: 4,
      avatar: "employee-2.png",
      firstName: "Aliaksei",
      lastName: "Yuryeu",
      email: "aliaksei.yuryeu@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
      skills: [],
    },
    {
      id: 5,
      avatar: "employee-1.png",
      firstName: "Pavel",
      lastName: "Zhukouski",
      email: "pavel.zhukouski@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
      skills: [],
    },
    {
      id: 6,
      avatar: "employee-2.png",
      firstName: "Aliaksei",
      lastName: "Yuryeu",
      email: "aliaksei.yuryeu@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
      skills: [],
    },
    {
      id: 7,
      avatar: "employee-1.png",
      firstName: "Pavel",
      lastName: "Zhukouski",
      email: "pavel.zhukouski@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
      skills: [],
    },
    {
      id: 8,
      avatar: "employee-2.png",
      firstName: "Aliaksei",
      lastName: "Yuryeu",
      email: "aliaksei.yuryeu@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
      skills: [],
    },
    {
      id: 9,
      avatar: "employee-1.png",
      firstName: "Pavel",
      lastName: "Zhukouski",
      email: "pavel.zhukouski@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
      skills: [],
    },
    {
      id: 10,
      avatar: "employee-2.png",
      firstName: "Aliaksei",
      lastName: "Yuryeu",
      email: "aliaksei.yuryeu@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
      skills: [],
    },
    {
      id: 11,
      avatar: "employee-1.png",
      firstName: "Pavel",
      lastName: "Zhukouski",
      email: "pavel.zhukouski@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
      skills: [],
    },
    {
      id: 12,
      avatar: "employee-2.png",
      firstName: "Aliaksei",
      lastName: "Yuryeu",
      email: "aliaksei.yuryeu@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
      skills: [],
    },
  ]);

  async function getUserById(targetId: number) {
    // if (users === null) { await Подтягиваем юзеров с сервера ... }
    return users.find((user) => user.id === targetId);
  }

  return { users, getUserById };
});
