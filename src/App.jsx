import { RecoilRoot } from "recoil";
import { CourseSelect } from "./CourseSelect";

export default function App({}) {
  return (
    <RecoilRoot>
      <h1>UT Course Planner</h1>
      <CourseSelect></CourseSelect>
    </RecoilRoot>
  );
}
