import moment from "moment-timezone";

const convertScheduleToTimeZone = (
  schedule,
  sourceTimeZone,
  targetTimeZone
) => {
  const convertedSchedule = schedule;
  let finalSchedule = {};

  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Get the UTC offsets for source and target timezones
  const sourceOffset = moment.tz(sourceTimeZone).utcOffset();
  const targetOffset = moment.tz(targetTimeZone).utcOffset();

  console.log("sourceOffset : ", sourceOffset);
  console.log("targetOffset : ", targetOffset);

  let diffOffset = targetOffset - sourceOffset;
  console.log(diffOffset);

  const updateDay = (timeSlot, diffOffset) => {
    timeSlot = timeSlot.toString();
    let timeInfo = timeSlot.split(":");
    let hours = parseInt(timeInfo[0]);
    let minutes = parseInt(timeInfo[1]);
    let totalMinutes = hours * 60 + minutes;

    if (diffOffset === 0) {
      return 0;
    } else if (diffOffset > 0) {
      if (totalMinutes - diffOffset >= 0) {
        return 0;
      } else {
        return -1;
      }
    } else {
      if (totalMinutes - diffOffset < 1440) {
        return 0;
      } else {
        return 1;
      }
    }
  };

  Object.keys(convertedSchedule).forEach((day) => {
    finalSchedule[day] = convertedSchedule[day].map((timeSlot) => {
      const targetTime = moment.tz(timeSlot.timeSlot, "HH:mm", targetTimeZone);
      let sourceTime = targetTime.clone().tz(sourceTimeZone);
      sourceTime = sourceTime.format("HH:mm");

      console.log("source Time : ", sourceTime);

      let dayDiff = updateDay(timeSlot.timeSlot, diffOffset);
      console.log("day diff : ", dayDiff);

      let sourceDayIndex = (weekDays.indexOf(day) + dayDiff) % 7;
      sourceDayIndex = sourceDayIndex < 0 ? sourceDayIndex + 7 : sourceDayIndex;
      let sourceDay = weekDays[sourceDayIndex];

      console.log("source day : ", sourceDay);

      let targetLabel = schedule[sourceDay].find(
        (obj) => obj.timeSlot === sourceTime
      ).label;

      return {
        timeSlot: timeSlot.timeSlot,
        label: targetLabel,
      };
    });
  });

  return finalSchedule;
};

export default convertScheduleToTimeZone;
