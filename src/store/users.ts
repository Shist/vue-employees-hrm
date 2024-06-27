import { defineStore } from "pinia";
import { reactive, Reactive } from "vue";
import IUserData from "@/types/IUserData";

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
    },
    {
      id: 2,
      avatar: "employee-2.png",
      firstName: "Aliaksei",
      lastName: "Yuryeu",
      email: "aliaksei.yuryeu@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
    },
    {
      id: 1,
      avatar: "employee-1.png",
      firstName: "Pavel",
      lastName: "Zhukouski",
      email: "pavel.zhukouski@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
    },
    {
      id: 2,
      avatar: "employee-2.png",
      firstName: "Aliaksei",
      lastName: "Yuryeu",
      email: "aliaksei.yuryeu@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
    },
    {
      id: 1,
      avatar: "employee-1.png",
      firstName: "Pavel",
      lastName: "Zhukouski",
      email: "pavel.zhukouski@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
    },
    {
      id: 2,
      avatar: "employee-2.png",
      firstName: "Aliaksei",
      lastName: "Yuryeu",
      email: "aliaksei.yuryeu@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
    },
    {
      id: 1,
      avatar: "employee-1.png",
      firstName: "Pavel",
      lastName: "Zhukouski",
      email: "pavel.zhukouski@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
    },
    {
      id: 2,
      avatar: "employee-2.png",
      firstName: "Aliaksei",
      lastName: "Yuryeu",
      email: "aliaksei.yuryeu@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
    },
    {
      id: 1,
      avatar: "employee-1.png",
      firstName: "Pavel",
      lastName: "Zhukouski",
      email: "pavel.zhukouski@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
    },
    {
      id: 2,
      avatar: "employee-2.png",
      firstName: "Aliaksei",
      lastName: "Yuryeu",
      email: "aliaksei.yuryeu@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
    },
    {
      id: 1,
      avatar: "employee-1.png",
      firstName: "Pavel",
      lastName: "Zhukouski",
      email: "pavel.zhukouski@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
    },
    {
      id: 2,
      avatar: "employee-2.png",
      firstName: "Aliaksei",
      lastName: "Yuryeu",
      email: "aliaksei.yuryeu@innowise.com",
      department: "Vue",
      position: "Vue Engineer",
    },
  ]);

  async function getUserById(targetId: number) {
    // if (users === null) { await Подтягиваем юзеров с сервера ... }
    return users.find((user) => user.id === targetId);
  }

  return { users, getUserById };
});
