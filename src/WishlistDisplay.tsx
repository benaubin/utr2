import { useRecoilState } from "recoil";
import { CourseList } from "./CourseList";
import { CourseListing } from "./schedule";
import { CourseUnique, wishlistState } from "./state";

function rebuildCourses(uniques: CourseUnique[]): CourseListing[] {
  const courses = [];
  let map = new Map<string, CourseListing>();
  for (const unique of uniques) {
    if (!map.has(unique.course)) {
      const course: CourseListing = { title: unique.course, uniques: [] };
      map.set(unique.course, course);
      courses.push(course);
    }
    map.get(unique.course).uniques.push(unique);
  }
  return courses;
}

export default function WishlistDisplay() {
  const [wishlist] = useRecoilState(wishlistState);

  return (
    <div style={{ maxHeight: "100%", overflow: "scroll" }}>
      <h2>Wishlist</h2>
      <CourseList courses={rebuildCourses(wishlist)} enableScheduling />
    </div>
  );
}
