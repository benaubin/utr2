import { atom, atomFamily, selector } from "recoil";
import { CourseListing, UniqueListing } from "./schedule";

export type CourseUnique = UniqueListing & { course: string };

export const wishlistState = atom({
  key: "wishlist",
  default: [] as CourseUnique[],
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
  uniques: CourseUnique[];
};

export const schedulesAtom = atomFamily<Schedule, number>({
  key: "schedules",
  default: { uniques: [] },
});

export const currentScheduleIdAtom = atom<number>({
  key: "current-schedule-id",
  default: 0,
});

export const currentScheduleSelector = selector({
  key: "current-schedule",
  get: ({ get }) => get(schedulesAtom(get(currentScheduleIdAtom))),
  set: ({ get, set }, newVal) =>
    set(schedulesAtom(get(currentScheduleIdAtom)), newVal),
});
