import TimeComponent from "./time";
import MetricsComponent from "./metrics";

export default function Home() {
  return (
    <>
      <div className="grid gap-2 grid-cols-12">
        <div className="col-span-6">
          <TimeComponent />
        </div>

        <div className="col-span-6">
          <MetricsComponent />
        </div>
      </div>
    </>
  );
}
