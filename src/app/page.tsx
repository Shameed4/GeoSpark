import { ArrowUpRight } from "lucide-react";

const blockClass = "w-[30%] h-40 bg-gradient-to-br from-black to-transparent rounded-md text-neutral-200 p-3"

export default function Home() {
  return (
    <div className="w-full">
      <header className="bg-cover h-52" style={{
        backgroundImage: `
      radial-gradient(ellipse 30% 30% at -20% -20%, white, transparent),
      radial-gradient(ellipse 150% 150% at 100% 0%, #A62100, #CED3CF)`
      }}>
        <h1 className="text-white text-lg">Dashboard Overview</h1>
      </header>
      <div className={"flex w-full justify-around -translate-y-24"}>
        <div className={blockClass}>
          <h4>Stony Brook, NY</h4>
          <h3 className="text-lg">25 AQI</h3>
          <div className="flex">
            <div className="flex">
              <div className="flex items-center text-[#6BEBA4] px-2 p-1 rounded-3xl bg-[rgba(38,102,99,0.2)]">
                <ArrowUpRight size={15} /> 4.8%
              </div>
              <div className="ml-1 py-1">from yesterday</div>
            </div>
          </div>
        </div>
        <div className={blockClass}>
          <h4>Humidity</h4>
          <h3 className="text-lg">25 AQI</h3>
          <div className="flex">
            <div className="flex">
              <div className="flex items-center text-[#6BEBA4] px-2 p-1 rounded-3xl bg-[rgba(38,102,99,0.2)]">
                <ArrowUpRight size={15} /> 37%
              </div>
              <div className="ml-1 py-1">from yesterday</div>
            </div>
          </div>
        </div>
        <div className={blockClass}>
          <h4>Stony Brook, NY</h4>
          <h3 className="text-lg">25 AQI</h3>
          <div className="flex">
            <div className="flex">
              <div className="flex items-center text-[#6BEBA4] px-2 p-1 rounded-3xl bg-[rgba(38,102,99,0.2)]">
                <ArrowUpRight size={15} /> 4.8%
              </div>
              <div className="ml-1 py-1">from yesterday</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
