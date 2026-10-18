import { timePeriod2string, parseTimePeriod, timePeriod2Milliseconds } from '../utils/time.js';

const now = new Date();

console.log('now =', now);
console.log('timePeriod2string(now, "1/2/0 04:05:06") =', timePeriod2string(parseTimePeriod("1/2/0 04:05:06")));
console.log('timePeriod2string(now, "1/2/1 04:05:06") =', timePeriod2string(parseTimePeriod("1/2/1 04:05:06")));
console.log('timePeriod2string(now, "1/2/2 04:05:06") =', timePeriod2string(parseTimePeriod("1/2/2 04:05:06")));
console.log('timePeriod2string(now, "1/2/3 04:05:06") =', timePeriod2string(parseTimePeriod("1/2/3 04:05:06")));
console.log('timePeriod2string(now, "1/2 04:05:06") =', timePeriod2string(parseTimePeriod("1/2 04:05:06")));
console.log('timePeriod2string(now, "1 04:05:06") =', timePeriod2string(parseTimePeriod("1 04:05:06")));
console.log('timePeriod2string(now, "04:05:06") =', timePeriod2string(parseTimePeriod("04:05:06")));
console.log('timePeriod2string(now, "1/2/3 04:05") =', timePeriod2string(parseTimePeriod("1/2/3 04:05")));
console.log('timePeriod2string(now, "1/2 04:05") =', timePeriod2string(parseTimePeriod("1/2 04:05")));
console.log('timePeriod2string(now, "1 04:05") =', timePeriod2string(parseTimePeriod("1 04:05")));
console.log('timePeriod2string(now, "04:05") =', timePeriod2string(parseTimePeriod("04:05")));
console.log('timePeriod2string(now, "1/2/3 04") =', timePeriod2string(parseTimePeriod("1/2/3 04")));
console.log('timePeriod2string(now, "1/2 04") =', timePeriod2string(parseTimePeriod("1/2 04")));
console.log('timePeriod2string(now, "1 04") =', timePeriod2Milliseconds("1 04"));
console.log('timePeriod2string(now, "04") =', timePeriod2Milliseconds("04"));