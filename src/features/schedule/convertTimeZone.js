import moment from "moment-timezone";
/*
 * converts the schedule from one timezone to other
 */
const convertScheduleToTimeZone = (
  schedule,
  sourceTimeZone,
  targetTimeZone
) => {
  let convertedSchedule = {};

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

  let diffOffset = targetOffset - sourceOffset;

  /*
   * function checks if day needs to be shift while updating label for different timezone
   * returns 0 if day is not required to shift
   * returns -1 if day needs to shift back by one day
   * return 1 if day need to shift ahead by one day
   */
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

  /*
   * this updates all the labels according to target timezone
   */
  Object.keys(schedule).forEach((day) => {
    convertedSchedule[day] = schedule[day].map((timeSlot) => {
      const targetTime = moment.tz(timeSlot.timeSlot, "HH:mm", targetTimeZone);
      let sourceTime = targetTime.clone().tz(sourceTimeZone);
      sourceTime = sourceTime.format("HH:mm");

      let dayDiff = updateDay(timeSlot.timeSlot, diffOffset);

      let sourceDayIndex = (weekDays.indexOf(day) + dayDiff) % 7;
      sourceDayIndex = sourceDayIndex < 0 ? sourceDayIndex + 7 : sourceDayIndex;
      let sourceDay = weekDays[sourceDayIndex];

      let targetLabel = schedule[sourceDay].find(
        (obj) => obj.timeSlot === sourceTime
      ).label;

      return {
        timeSlot: timeSlot.timeSlot,
        label: targetLabel,
      };
    });
  });

  return convertedSchedule;
};

export default convertScheduleToTimeZone;
