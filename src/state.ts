import { selector } from "recoil";

export const subjectsQuery = selector({
  key: "subjects",
  get: async ({}) => {
    const res = await fetch("/api/terms/2023%20Spring/subjects");
    return await res.json();
  },
});
