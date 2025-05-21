"use client"
import React, { useEffect, useState } from 'react';

const useCountdown = (targetDate) => {
  const countDownDate = new Date(targetDate).getTime();
  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());
  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown) => {
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
  return [days, hours, minutes, seconds];
};

const TimerBox = ({ timerFor, timerValue }) => {
  return (
    <div>
      <div className="bg-[#fff] rounded text-[32px] w-[70px] h-[70px] flex justify-center items-center shadow-md">
        {timerValue}
      </div>
      <h5 className="mt-1 text-sm">
        {timerFor}
      </h5>
    </div>
  );
};

const CountdownTimer = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  return (
    <div>
      <div className="flex gap-1 mt-4 flex-wrap countdown mb-8">
        {days > 0 || hours > 0 || minutes > 0 || seconds > 0 ? (
          <div className="flex text-center gap-4">
            <TimerBox timerFor={'Days'} timerValue={days} />
            <TimerBox timerFor={'Hours'} timerValue={hours} />
            <TimerBox timerFor={'Minutes'} timerValue={minutes} />
            <TimerBox timerFor={'Seconds'} timerValue={seconds} />
          </div>
        ) : (
          <p className="text-3xl font-semibold text-red-500">Offer has expired on {targetDate}.</p>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer
