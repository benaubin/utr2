import { atom, AtomEffect, atomFamily, DefaultValue, selector } from "recoil";
import { CourseListing, UniqueListing } from "./schedule";

export type CourseUnique = UniqueListing & { course: string };

const syncToLocalStorage = (key: string): AtomEffect<any> => {
  return ({ setSelf, onSet }) => {
    onSet((newVal) => {
      localStorage.setItem(key, JSON.stringify(newVal));
    });
    const update = () => {
      const json = localStorage.getItem(key);
      if (json) setSelf(JSON.parse(json));
    };
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  };
};

export const wishlistState = atom({
  key: "wishlist",
  default: [] as CourseUnique[],
  effects: [syncToLocalStorage("com.benaubin.utr2.wishlist")],
});

export const wishlistSetSelector = selector({
  key: "wishlist-set",
  get: ({ get }) => {
    const set = new Set();
    for (const unique of get(wishlistState)) {
      set.add(unique.unique);
    }
    return set;
  },
});

export type Schedule = {
  title: string;
  uniques: CourseUnique[];
};

export const schedulesAtom = atom<Schedule[]>({
  key: "schedules",
  default: [{ title: "Schedule 1", uniques: [] }],
  effects: [syncToLocalStorage("com.benaubin.utr2.schedules")],
});

export const currentScheduleIdAtom = atom<number>({
  key: "current-schedule-id",
  default: 0,
});

export const currentScheduleSelector = selector({
  key: "current-schedule",
  get: ({ get }) => get(schedulesAtom)[get(currentScheduleIdAtom)],
  set: ({ get, set }, newVal) =>
    set(schedulesAtom, (schedules) => {
      let s = [...schedules];
      let id = get(currentScheduleIdAtom);
      s[id] =
        newVal instanceof DefaultValue
          ? { title: `Schedule ${id}`, uniques: [] }
          : newVal;
      return s;
    }),
});
