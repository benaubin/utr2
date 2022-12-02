import { Suspense } from "react";
import { RecoilRoot, useRecoilState } from "recoil";
import { CourseSelect } from "./CourseSelect";
import * as styles from "./App.module.css";
import WishlistDisplay from "./WishlistDisplay";
import { Calendar } from "./Calendar";
import { currentScheduleIdAtom, currentScheduleSelector } from "./state";

function ScheduleSwitcher() {
  const [currentScheduleId, setCurrentScheduleId] = useRecoilState(
    currentScheduleIdAtom
  );
  return <div>Schedule {currentScheduleId}</div>;
}

export default function App({}) {
  return (
    <RecoilRoot>
      <h1>UT Registration 2</h1>
      <div className={styles.app}>
        <div>
          <Suspense>
            <CourseSelect></CourseSelect>
          </Suspense>
        </div>

        <div>
          <ScheduleSwitcher></ScheduleSwitcher>
          <Calendar />
          <Suspense>
            <WishlistDisplay></WishlistDisplay>
          </Suspense>
        </div>
      </div>
    </RecoilRoot>
  );
}
