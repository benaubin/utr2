import namecase from "namecase";
import { Suspense, useDeferredValue, useEffect, useRef, useState } from "react";
import { RecoilRoot, useRecoilState } from "recoil";
import * as styles from "./App.module.css";
import { Calendar } from "./Calendar";
import { CourseSelect } from "./CourseSelect";
import { courseShortName } from "./schedule";
import { currentScheduleIdAtom, schedulesAtom } from "./state";
import WishlistDisplay from "./WishlistDisplay";

function ScheduleDisplay() {
  const [schedules, setSchedules] = useRecoilState(schedulesAtom);
  const [current, setCurrent] = useRecoilState(currentScheduleIdAtom);
  return (
    <div>
      <h2>Schedules</h2>
      <div style={{ display: "flex", alignItems: "center" }}>
        {schedules.map((schedule, i) => {
          return (
            <a
              key={i}
              style={{
                padding: "12px 12px 6px 12px",
                marginRight: 12,
                borderRadius: i == current ? "8px 8px 0 0" : "",
                background: i === current ? "#7FDBFF" : "",
              }}
              onClick={() => {
                setCurrent(i);
              }}>
              {schedule.title}
            </a>
          );
        })}
        <div>
          <button
            onClick={() => {
              setSchedules([
                ...schedules,
                { title: `Schedule ${schedules.length + 1}`, uniques: [] },
              ]);
            }}>
            Create
          </button>
        </div>
      </div>
      <Calendar />
      <h3>Selected courses</h3>
      <ul>
        {schedules[current].uniques.map((unique) => (
          <li key={unique.unique}>
            {unique.unique} {courseShortName(unique.course)}{" "}
            {unique.instructors[0]
              ? `with ${namecase(unique.instructors[0].last_name)}`
              : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App({}) {
  const [showCourseSelect_, setShowCourseSelect] = useState(false);
  const showCourseSelect = useDeferredValue(showCourseSelect_);
  const dialogRef = useRef<HTMLDialogElement>();
  useEffect(() => {
    if (showCourseSelect) dialogRef.current!.showModal();
  }, [showCourseSelect]);
  return (
    <RecoilRoot>
      <nav>
        <h1>UT Registration 2</h1>
        <button
          onClick={() => {
            setShowCourseSelect(true);
          }}>
          Search for Classes
        </button>
      </nav>
      <Suspense>
        {showCourseSelect && (
          <dialog
            ref={dialogRef}
            role="dialog"
            style={{
              width: "600px",
              maxWidth: "100vw",
              height: "80vh",
              overflow: "scroll",
              position: "relative",
            }}
            onClose={() => {
              setShowCourseSelect(false);
            }}>
            <div style={{ minHeight: "100%" }}>
              <CourseSelect></CourseSelect>
            </div>
            <footer
              style={{ position: "sticky", bottom: 0, left: 0, right: 0 }}>
              <button
                style={{
                  background: "#0074D9",
                  color: "white",
                  width: "100%",
                  outline: "none",
                  border: "none",
                  padding: 12,
                }}
                onClick={(e) => {
                  setShowCourseSelect(false);
                }}>
                Done
              </button>
            </footer>
          </dialog>
        )}
      </Suspense>
      <div className={styles.app}>
        <div>
          <Suspense>
            <WishlistDisplay />
          </Suspense>
        </div>
        <div>
          <Suspense>
            <ScheduleDisplay />
          </Suspense>
        </div>
      </div>
    </RecoilRoot>
  );
}
