import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const getRotation = (hand, maxUnits) => {
    const units = hand === 'hour' ? 12 : maxUnits;
    const unitDegree = 360 / units;
    const currentTime = new Date();
    let current;

  if (hand === 'hour') {
    current = currentTime.getHours() % 12;
  } else if (hand === 'minute') {
    current = currentTime.getMinutes();
  } else if (hand === 'second') {
    current = currentTime.getSeconds();
  }
  return `rotate(${current * unitDegree}deg)`;

  };

  
   const  date = new Date();
   const  options = {
     weekday: 'long',
     year: 'numeric',
     month: 'long',
     day: 'numeric',
     timeZone: 'IST',  
}
const localDate = date.toLocaleDateString('en-US', options).toLocaleUpperCase();

  return (
    <div className="clock">
            <span className="time-date">{localDate}</span>

      <div
        className="hand hour-hand"
        style={{ transform: getRotation('hour', 12) }}
      ></div>
      <div
        className="hand minute-hand"
        style={{ transform: getRotation('minute', 60) }}
      ></div>
      <div
        className="hand second-hand"
        style={{ transform: getRotation('second', 60) }}
      ></div>
      <div className="clock-face">

      <h1>Coming soon at your City</h1>
      </div>
    </div>
  );
};

export default Clock;
