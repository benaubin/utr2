import { selector, selectorFamily } from "recoil";
import namecase from "namecase";

function encodeQuery(query: Record<string, string>): string {
  return (
    "?" +
    Object.keys(query)
      .map((key) => {
        const value = query[key];
        return encodeURIComponent(key) + "=" + encodeURIComponent(value);
      })
      .join("&")
  );
}

export function rmpLink(i: Instructor) {
  return `https://www.ratemyprofessors.com/search/teachers?query=${encodeURIComponent(
    `${namecase(i.first_name.split(" ")[0])} ${namecase(i.last_name)}`
  )}&sid=U2Nob29sLTEyNTU=`;
}

export function ecisLink(instructor: Instructor) {
  return `https://utdirect.utexas.edu/ctl/ecis/results/search.WBX?&s_in_action_sw=S&s_in_search_type_sw=N&s_in_search_name=${encodeURIComponent(
    `${namecase(instructor.last_name)}, ${namecase(instructor.first_name)}`
  )}`;
}

export const ccyys = "20232";
export const scheduleRoot =
  "https://utdirect.utexas.edu/apps/registrar/course_schedule/" + ccyys;

export interface FieldOfStudy {
  code: string;
  name: string;
}

export const fieldsQuery = selector({
  key: "fields",
  get: async ({}) => {
    const res = await fetch(scheduleRoot);
    const doc = new DOMParser().parseFromString(await res.text(), "text/html");

    const fos_fl = doc.getElementById("fos_fl")!;
    const fields: FieldOfStudy[] = [];
    for (const child of fos_fl.children) {
      const [code, name] = child.textContent!.split(" - ");
      if (!code || !name) continue;
      fields.push({ code, name });
    }

    return fields;
  },
});
export interface MeetingTime {
  location: string;
  days: string;
  startTime: number; // minutes from start of day
  endTime: number; // minutes from start of day
}

export interface Instructor {
  first_name: string;
  last_name: string;
}

export interface UniqueListing {
  unique: string;
  meetings: MeetingTime[];
  instructionMode: string;
  instructors: Instructor[];
  status: string;
  flags: {
    code: string;
    title: string;
    display: string;
  }[];
  core: null | {
    code: string;
    title: string;
    display: string;
  };
}

export interface CourseListing {
  title: string;
  uniques: UniqueListing[];
}

export type CourseSearch = {
  field: string;
  level: string;
};

function parseListings(table: HTMLTableElement) {
  if (table == null) return [];
  const results = table.querySelector("tbody");

  let courses: CourseListing[] = [];

  for (const result of results.children) {
    if (result.children[0].classList.contains("course_header")) {
      courses.push({
        title: result.children[0].textContent || "",
        uniques: [],
      });
    } else {
      const days = result.querySelectorAll('[data-th="Days"] span')!;
      const hours = result.querySelectorAll('[data-th="Hour"] span')!;
      const rooms = result.querySelectorAll('[data-th="Room"] span')!;
      console.assert(
        days.length == hours.length && days.length == rooms.length
      );

      const meetings: MeetingTime[] = [];
      for (let i = 0; i < days.length; i++) {
        const day = days[i].textContent!;
        const hour = hours[i].textContent!;
        const room = rooms[i].textContent!;

        const [startTime, endTime] = hour.split("-").map((hour) => {
          const [time, m] = hour.split(" ");
          let [hours, minutes] = time.split(":").map(Number);
          if (m == "p.m.") hours += 12;
          return hours * 60 + minutes;
        });

        meetings.push({ location: room, days: day, startTime, endTime });
      }

      const instructors: Instructor[] = Array.from(
        result.querySelectorAll('[data-th="Instructor"] span')
      ).map((span) => {
        const [last, first] = span.textContent!.split(", ");
        return {
          first_name: first,
          last_name: last,
        };
      });

      if (courses.length == 0)
        courses.push({
          title: "",
          uniques: [],
        });
      courses[courses.length - 1].uniques.push({
        unique: result.querySelector('[data-th="Unique"]')!.textContent!,
        meetings,
        instructionMode: result.querySelector('[data-th="Instruction Mode"]')!
          .textContent!,
        instructors,
        status: result.querySelector('[data-th="Status"]')!.textContent!,
        flags: [],
        core: null,
      });
    }
  }

  return courses;
}

export const coursesQuery = selectorFamily({
  key: "courses",
  get:
    ({ field, level }: CourseSearch) =>
    async () => {
      if (!field) return [];
      const res = await fetch(
        scheduleRoot +
          "/results/" +
          encodeQuery({
            ccyys,
            search_type_main: "FIELD",
            fos_fl: field,
            level,
          })
      );
      const doc = new DOMParser().parseFromString(
        await res.text(),
        "text/html"
      );
      return parseListings(doc.querySelector(".results"));
    },
});

export const uniqueQuery = selectorFamily({
  key: "unique-course",
  get: (unique: string) => async () => {
    const res = await fetch(scheduleRoot + "/" + encodeURIComponent(unique));
    const doc = new DOMParser().parseFromString(await res.text(), "text/html");
    const listing = parseListings(doc.querySelector("#details_table"))[0];
    listing.title = doc.querySelector("#details h2").textContent;
    const details = Array.from(doc.querySelectorAll("#details p")).map(
      (details) => details.textContent
    );
    return { listing, details };
  },
});
