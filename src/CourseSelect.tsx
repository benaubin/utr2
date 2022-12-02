import { Suspense, useState, useDeferredValue } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Select from "react-select";
import { wishlistSetSelector, wishlistState } from "./state";
import {
  CourseListing,
  CourseSearch,
  coursesQuery,
  ecisLink,
  fieldsQuery,
  levels,
  rmpLink,
  scheduleRoot,
} from "./schedule";
import * as styles from "./CourseSelect.module.css";
import namecase from "namecase";

function strTime(time: number, withM = true): string {
  let hours = Math.floor(time / 60);
  const minutes = time % 60;
  let m = "a.m.";
  if (hours > 12) {
    hours -= 12;
    m = "p.m.";
  }
  return (
    hours + ":" + minutes.toString().padStart(2, "0") + (withM ? " " + m : "")
  );
}

function CourseSearchListings({ q }: { q: CourseSearch }) {
  const [page_, setPage] = useState([1, q] as [number, CourseSearch]);
  const page = useDeferredValue(page_[1] == q ? page_[0] : 1);
  const c = useDeferredValue(q);
  const { listings: courses, nextUnique } = useRecoilValue(
    coursesQuery({ q: c, page })
  );

  const [wishlist, setWishlist] = useRecoilState(wishlistState);
  const wishlistSet = useRecoilValue(wishlistSetSelector);

  return (
    <div>
      {courses.map((course) => {
        const map = new Map<
          string,
          { instructors: string; uniques: CourseListing["uniques"] }
        >();
        course.uniques.forEach((unique, i) => {
          const instructors = unique.instructors
            .map((i) => i.last_name + ", " + i.first_name)
            .join("; ");
          if (!map.has(instructors))
            map.set(instructors, {
              instructors,
              uniques: [],
            });
          map.get(instructors).uniques.push(unique);
        });

        return (
          <div key={course.title} className={styles.course}>
            <h2>{course.title}</h2>
            {Array.from(map.values()).map(({ uniques, instructors }) => {
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
                      <div>
                        <input
                          type="checkbox"
                          className={styles.uniqueSelect}
                          checked={wishlistSet.has(unique.unique)}
                          onChange={(e) => {
                            if (
                              e.target.checked == wishlistSet.has(unique.unique)
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
                      <div>
                        <a href={`${scheduleRoot}/${unique.unique}`}>
                          {unique.unique}
                        </a>
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

      {nextUnique && (
        <button
          onClick={() => setPage([page + 1, q])}
          style={{ marginBottom: "20px" }}>
          Load more
        </button>
      )}
    </div>
  );
}

export function CourseSelect() {
  const fields = useRecoilValue(fieldsQuery);
  const [level, setLevel] = useState(levels[0]);
  const [field, setField] = useState(null);

  return (
    <div>
      <Select
        defaultValue={field}
        onChange={({ value }) => setField(value)}
        options={fields.map((field) => ({
          value: field.code,
          label: `${field.code} - ${field.name}`,
        }))}
      />
      <Select
        defaultValue={level}
        onChange={(level) => setLevel(level)}
        options={levels as any}
      />
      <Suspense>
        <CourseSearchListings
          q={{
            level: level.value,
            field,
          }}></CourseSearchListings>
      </Suspense>
    </div>
  );
}
