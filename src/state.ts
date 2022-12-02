import { atom, selector } from "recoil";
import { CourseListing, UniqueListing } from "./schedule";

export const wishlistState = atom({
  key: "wishlist",
  default: [] as (UniqueListing & { course: string })[],
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
