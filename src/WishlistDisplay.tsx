import { useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { uniqueQuery } from "./schedule";
import { currentScheduleSelector, wishlistState } from "./state";

export default function WishlistDisplay() {
  const [wishlist] = useRecoilState(wishlistState);
  const [schedule, setSchedule] = useRecoilState(currentScheduleSelector);

  const scheduledCourses = useMemo(
    () => new Set(schedule.uniques.map((u) => u.unique)),
    [schedule]
  );

  return (
    <div>
      <h2>Wishlist:</h2>
      {wishlist.map((unique) => {
        return (
          <div key={unique.unique}>
            <input
              type="checkbox"
              checked={scheduledCourses.has(unique.unique)}
              onChange={(e) => {
                if (e.target.checked == scheduledCourses.has(unique.unique))
                  return;
                if (e.target.checked) {
                  setSchedule({
                    ...schedule,
                    uniques: [...schedule.uniques, unique],
                  });
                } else {
                  setSchedule({
                    ...schedule,
                    uniques: schedule.uniques.filter(
                      (u) => u.unique != unique.unique
                    ),
                  });
                }
              }}></input>
            {unique.unique} {unique.course}
          </div>
        );
      })}
    </div>
  );
}
