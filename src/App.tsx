import { Suspense } from "react";
import { RecoilRoot } from "recoil";
import { CourseSelect } from "./CourseSelect";
import * as styles from "./App.module.css";
import WishlistDisplay from "./WishlistDisplay";
import { Calendar } from "./Calendar";

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
          <Calendar />
          <Suspense>
            <WishlistDisplay></WishlistDisplay>
          </Suspense>
        </div>
      </div>
    </RecoilRoot>
  );
}
