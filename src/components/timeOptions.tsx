"use client";
import { useState } from "react";

export default function TimeOptions() {
    const [timeOption, setTimeOption] = useState("Daily");
    return (
      <>
        {["Daily", "Weekly", "Monthly", "Yearly"].map(time => (
          <div key={time} className={`${time == timeOption ? "bg-[rgb(41,41,44)]" : ""} px-4 py-1 cursor-pointer rounded-md`} onClick={() => setTimeOption(time)}>
            {time}
          </div>
        ))}
      </>
    );
  }