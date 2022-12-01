import { useState } from "react";
import { useRecoilValue } from "recoil";
import Select from "react-select";
import { subjectsQuery } from "./state";

export function CourseSelect() {
  const subjects = useRecoilValue(subjectsQuery);
  const [subject, setSubject] = useState(null);

  return (
    <div>
      <Select
        defaultValue={subject}
        onChange={setSubject}
        options={subjects.map((subject) => ({
          value: subject.id,
          label: subject.title,
        }))}
      />
    </div>
  );
}
