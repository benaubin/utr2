import namecase from "namecase";
import { useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { groupByInstructor } from "./CourseSelect";
import * as styles from "./CourseSelect.module.css";
import {
  CourseListing,
  ecisLink,
  rmpLink,
  scheduleRoot,
  strTime,
} from "./schedule";
import {
  currentScheduleSelector,
  wishlistSetSelector,
  wishlistState,
} from "./state";

export function CourseList({
  courses,
  enableScheduling,
}: {
  courses: CourseListing[];
  enableScheduling?: boolean;
}) {
  const [wishlist, setWishlist] = useRecoilState(wishlistState);
  const wishlistSet = useRecoilValue(wishlistSetSelector);

  const [schedule, setSchedule] = useRecoilState(currentScheduleSelector);
  const scheduledCourses = useMemo(
    () => new Set(schedule.uniques.map((u) => u.unique)),
    [schedule]
  );

  return (
    <div>
      {courses.map((course) => {
        const map = groupByInstructor(course.uniques);

        return (
          <div key={course.title} className={styles.course}>
            <h2>{course.title}</h2>
            {Array.from(map.entries()).map(([instructors, uniques]) => {
              return (
                <div className={styles.instructorGroup} key={instructors}>
                  <h3 className={styles.instructor}>
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
                  </h3>
                  {uniques.map((unique) => (
                    <div className={styles.unique} key={unique.unique}>
                      <div style={{ textAlign: "center" }}>
                        <div>
                          <input
                            type="checkbox"
                            className={styles.uniqueSelect}
                            checked={wishlistSet.has(unique.unique)}
                            onChange={(e) => {
                              if (
                                e.target.checked ==
                                wishlistSet.has(unique.unique)
                              )
                                return;
                              let w;
                              if (e.target.checked)
                                w = [
                                  ...wishlist,
                                  {
                                    ...unique,
                                    course: course.title,
                                  },
                                ];
                              else
                                w = wishlist.filter(
                                  (u) => u.unique != unique.unique
                                );
                              setWishlist(w);
                            }}></input>
                        </div>
                      </div>
                      <div>
                        <div>
                          <a href={`${scheduleRoot}/${unique.unique}`}>
                            {unique.unique}
                          </a>
                        </div>
                        {enableScheduling && (
                          <div style={{ textAlign: "right" }}>
                            <input
                              type="checkbox"
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
                                    uniques: [
                                      ...schedule.uniques,
                                      { ...unique, course: course.title },
                                    ],
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
                          </div>
                        )}
                      </div>
                      <div>
                        <div>{unique.instructionMode}</div>
                        {unique.meetings.map((meeting, i) => (
                          <div className={styles.meeting} key={i}>
                            <div>
                              {meeting.days} {strTime(meeting.startTime, false)}{" "}
                              - {strTime(meeting.endTime)}
                            </div>
                            <div>{meeting.location}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
