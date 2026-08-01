/**
 * slotCalculator.js
 * المسؤول عن حساب الأوقات المتاحة للحجز لطبيب معين في يوم معين،
 * بناءً على جدول عمله الأسبوعي، مدة الخدمة، والحجوزات الموجودة بالفعل.
 */

const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// Convert "HH:mm" -> minutes since midnight
const timeToMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

// Convert minutes since midnight -> "HH:mm"
const minutesToTime = (mins) => {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

/**
 * @param {Object} doctor - Doctor document (with workingHours, daysOff)
 * @param {Date} date - The requested day
 * @param {Number} durationMinutes - Duration of the requested service
 * @param {Array} existingAppointments - Appointments already booked for that doctor/day
 *        each item: { startTime: 'HH:mm', endTime: 'HH:mm' }
 * @param {Object} clinicClosedDates - Array of clinic-wide closed Date objects
 * @param {Number} slotStepMinutes - Granularity of slots offered (default 15 min)
 * @returns {Array<String>} list of available start times, e.g. ['10:00', '10:15', ...]
 */
function getAvailableSlots({
  doctor,
  date,
  durationMinutes,
  existingAppointments = [],
  clinicClosedDates = [],
  slotStepMinutes = 15,
}) {
  const dayName = dayNames[new Date(date).getDay()];

  // 1) Check clinic-wide closed dates
  const isClinicClosed = clinicClosedDates.some(
    (d) => new Date(d).toDateString() === new Date(date).toDateString()
  );
  if (isClinicClosed) return [];

  // 2) Check doctor's personal days off
  const isDoctorOff = (doctor.daysOff || []).some(
    (d) => new Date(d).toDateString() === new Date(date).toDateString()
  );
  if (isDoctorOff) return [];

  // 3) Find the doctor's working hours for this weekday
  const workingHour = (doctor.workingHours || []).find(
    (wh) => wh.day === dayName && wh.isActive !== false
  );
  if (!workingHour) return []; // doctor doesn't work this day

  const dayStart = timeToMinutes(workingHour.startTime);
  const dayEnd = timeToMinutes(workingHour.endTime);

  // 4) Build list of busy ranges (in minutes) from existing appointments
  const busyRanges = existingAppointments.map((a) => ({
    start: timeToMinutes(a.startTime),
    end: timeToMinutes(a.endTime),
  }));

  // 5) Walk through the day in slotStepMinutes increments,
  //    and keep any slot where [slotStart, slotStart+duration] fits
  //    within working hours and doesn't overlap any busy range.
  const availableSlots = [];
  for (let t = dayStart; t + durationMinutes <= dayEnd; t += slotStepMinutes) {
    const slotStart = t;
    const slotEnd = t + durationMinutes;

    const overlaps = busyRanges.some(
      (b) => slotStart < b.end && slotEnd > b.start // standard interval overlap check
    );

    if (!overlaps) {
      availableSlots.push(minutesToTime(slotStart));
    }
  }

  return availableSlots;
}

module.exports = { getAvailableSlots, timeToMinutes, minutesToTime };
