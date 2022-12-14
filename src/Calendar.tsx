import { useRecoilValue } from "recoil";
import {
  courseShortName,
  MeetingDay,
  MeetingTime,
  parseDays,
  strTime,
} from "./schedule";
import { CourseUnique, currentScheduleSelector } from "./state";
import namecase from "namecase";

export function Calendar() {
  const schedule = useRecoilValue(currentScheduleSelector);

  const startOfDay = 8 * 60;
  const endOfDay = (12 + 9) * 60;
  const lenOfDay = endOfDay - startOfDay;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
      }}
      onDragEnter={(e) => {
        console.log(e.target);
      }}>
      {[
        { name: "Mon", val: MeetingDay.Monday },
        { name: "Tue", val: MeetingDay.Tuesday },
        { name: "Wed", val: MeetingDay.Wednesday },
        { name: "Thu", val: MeetingDay.Thursday },
        { name: "Fri", val: MeetingDay.Friday },
      ].map(({ name, val }) => {
        const meetings: { meeting: MeetingTime; unique: CourseUnique }[] = [];
        for (const unique of schedule.uniques) {
          for (const meeting of unique.meetings) {
            const days = parseDays(meeting.days);
            if (days & val) {
              meetings.push({ meeting, unique });
            }
          }
        }

        return (
          <div key={name}>
            <h2 style={{ textAlign: "center", padding: 0, fontSize: 16 }}>
              {name}
            </h2>
            <div
              className="events"
              style={{ position: "relative", height: "500px" }}>
              {meetings.map(({ meeting, unique }) => {
                const top = Math.floor(
                  (Math.max(meeting.startTime - startOfDay, 0) / lenOfDay) * 100
                );
                const bottom = Math.floor(
                  (Math.max(endOfDay - (meeting.endTime - 15), 0) / lenOfDay) *
                    100
                );
                return (
                  <div
                    key={JSON.stringify(meeting)}
                    style={{
                      position: "absolute",
                      top: top + "%",
                      bottom: bottom + "%",
                      background: "#0074D9",
                      color: "white",
                      padding: "2px",
                      width: "100%",
                      boxSizing: "border-box",
                      fontSize: "12px",
                    }}>
                    <div
                      style={{
                        fontWeight: "600",
                      }}>
                      {courseShortName(unique.course)}
                      {unique.instructors[0]
                        ? " with " + namecase(unique.instructors[0]?.last_name)
                        : ""}
                    </div>
                    <div>
                      {meeting.location} {strTime(meeting.startTime, false)} -{" "}
                      {strTime(meeting.endTime)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
