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
    console.log("time INfo ", timeInfo);
    let hours = parseInt(timeInfo[0]);
    let minutes = parseInt(timeInfo[1]);
    let totalMinutes = hours * 60 + minutes;
    let totalMinutesFromEnd = 1440 - totalMinutes;

    console.log("total minutes : ", totalMinutes);
    console.log("total minutes from end : ", totalMinutesFromEnd);

    if (diffOffset === 0) {
      return 0;
    } else if (diffOffset > 0) {
      if (Math.abs(totalMinutes) < Math.abs(diffOffset)) {
        return -1;
      } else {
        return 0;
      }
    } else {
      if (Math.abs(totalMinutesFromEnd) < Math.abs(diffOffset)) {
        return 1;
      } else {
        return 0;
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

      let sourceDay = weekDays[(weekDays.indexOf(day) + dayDiff) % 7];
      if (weekDays.indexOf(day) === 0 && dayDiff < 0) {
        sourceDay = weekDays[6];
      }

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
