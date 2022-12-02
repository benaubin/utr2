import { useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { groupByInstructor } from "./CourseSelect";
import { ecisLink, rmpLink, strTime, uniqueQuery } from "./schedule";
import { CourseUnique, currentScheduleSelector, wishlistState } from "./state";
import namecase from "namecase";

export default function WishlistDisplay() {
  const [wishlist] = useRecoilState(wishlistState);
  const [schedule, setSchedule] = useRecoilState(currentScheduleSelector);

  const scheduledCourses = useMemo(
    () => new Set(schedule.uniques.map((u) => u.unique)),
    [schedule]
  );

  const courses = useMemo(() => {
    let courses = new Map<string, CourseUnique[]>();
    for (const unique of wishlist) {
      if (!courses.has(unique.course)) courses.set(unique.course, []);
      courses.get(unique.course).push(unique);
    }
    return courses;
  }, [wishlist]);

  return (
    <div>
      <h2>Wishlist:</h2>
      {Array.from(courses.entries()).map(([course, uniques]) => {
        const map = groupByInstructor(uniques);
        return (
          <div key={course}>
            <h3>{course}</h3>
            {Array.from(map.entries()).map(([instructors, uniques]) => {
              return (
                <div>
                  {uniques[0].instructors.map((i) => {
                    let full = namecase(`${i.first_name} ${i.last_name}`);
                    return (
                      <div key={full}>
                        {full}{" "}
                        <a href={rmpLink(i)} target="_blank">
                          RMP
                        </a>{" "}
                        <a href={ecisLink(i)} target="_blank">
                          eCIS
                        </a>
                      </div>
                    );
                  })}
                  {uniques.map((unique) => {
                    return (
                      <div key={unique.unique}>
                        <input
                          type="checkbox"
                          name={unique.course}
                          checked={scheduledCourses.has(unique.unique)}
                          onChange={(e) => {
                            if (
                              e.target.checked ==
                              scheduledCourses.has(unique.unique)
                            )
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
                        {unique.unique}
                        {unique.meetings.map((meeting) => {
                          return (
                            <div>
                              {meeting.days} {strTime(meeting.startTime, false)}{" "}
                              -{strTime(meeting.endTime)}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
