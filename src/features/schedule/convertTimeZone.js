import moment from "moment-timezone";

const convertScheduleToTimeZone = (
  schedule,
  sourceTimeZone,
  targetTimeZone
) => {
  const convertedSchedule = {};

  Object.keys(schedule).forEach((day) => {
    convertedSchedule[day] = schedule[day].map((timeSlot) => {
      const sourceTime = moment.tz(timeSlot.timeSlot, "HH:mm", sourceTimeZone);
      const convertedTime = sourceTime.clone().tz(targetTimeZone);

      return {
        timeSlot: convertedTime.format("HH:mm"),
        label: timeSlot.label,
      };
    });
  });

  return convertedSchedule;
};

export default convertScheduleToTimeZone;
