import { TubesCursor } from "./tube-cursor";

export default function DemoOne() {
  return <TubesCursor
        title="Tubes"
        subtitle="Cursor"
        caption="Click to Change- by Rahil Vahora"
        initialColors={["#ff0000", "#00ff00", "#0000ff"]}
        lightColors={["#ffff00", "#ff00ff", "#00ffff", "#ffffff"]}
        lightIntensity={250}
        titleSize="text-[70px]"
        subtitleSize="text-[50px]"
        captionSize="text-lg"
        enableRandomizeOnClick
      />;
}
