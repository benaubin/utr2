import { Suspense, useState, useDeferredValue } from "react";
import { useRecoilValue } from "recoil";
import Select from "react-select";
import {
  CourseSearch,
  coursesQuery,
  fieldsQuery,
  levels,
  UniqueListing,
} from "./schedule";
import { CourseList } from "./CourseList";

export function groupByInstructor<T extends UniqueListing>(
  uniques: T[]
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  uniques.forEach((unique, i) => {
    const instructors = unique.instructors
      .map((i) => i.last_name + ", " + i.first_name)
      .join("; ");
    if (!map.has(instructors)) map.set(instructors, []);
    map.get(instructors).push(unique);
  });
  return map;
}

function CourseSearchListings({ q }: { q: CourseSearch }) {
  const [page_, setPage] = useState([1, q] as [number, CourseSearch]);
  const page = useDeferredValue(page_[1] == q ? page_[0] : 1);
  const c = useDeferredValue(q);
  const { listings: courses, nextUnique } = useRecoilValue(
    coursesQuery({ q: c, page })
  );

  return (
    <div>
      <CourseList courses={courses}></CourseList>
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
