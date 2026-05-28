import "./index.css";
import { Composition, getStaticFiles } from "remotion";
import { AIVideo, aiVideoSchema } from "./components/AIVideo";
import { FPS, INTRO_DURATION } from "./lib/constants";
import { getTimelinePath, loadTimelineFromFile } from "./lib/utils";
import { HireScanVideo, HIRESCAN_TOTAL_FRAMES } from "./HireScan";
import { HireScanAd, HIRESCAN_AD_FRAMES } from "./HireScanAd";
import { HireScanAdV2, CINEMATIC_FRAMES } from "./HireScanAdV2";
import { HireScanAdV3, HIRESCAN_V3_FRAMES } from "./HireScanAdV3";
import { HireScanAdV4, HIRESCAN_V4_FRAMES } from "./HireScanAdV4";

export const RemotionRoot: React.FC = () => {
  const staticFiles = getStaticFiles();
  const timelines = staticFiles
    .filter((file) => file.name.endsWith("timeline.json"))
    .map((file) => file.name.split("/")[1]);

  return (
    <>
      <Composition id="HireScan" component={HireScanVideo} fps={30} width={1920} height={1080} durationInFrames={HIRESCAN_TOTAL_FRAMES} />
      <Composition id="HireScanAd" component={HireScanAd} fps={30} width={1080} height={1920} durationInFrames={HIRESCAN_AD_FRAMES} />
      <Composition id="HireScanAdV2" component={HireScanAdV2} fps={30} width={1080} height={1920} durationInFrames={CINEMATIC_FRAMES} />
      <Composition id="HireScanAdV3" component={HireScanAdV3} fps={30} width={1080} height={1920} durationInFrames={HIRESCAN_V3_FRAMES} />
      <Composition id="HireScanAdV4" component={HireScanAdV4} fps={30} width={1080} height={1920} durationInFrames={HIRESCAN_V4_FRAMES} />
      {timelines.map((storyName) => (
        <Composition
          id={storyName} component={AIVideo} fps={FPS} width={1080} height={1920}
          schema={aiVideoSchema} defaultProps={{ timeline: null }}
          calculateMetadata={async ({ props }) => {
            const { lengthFrames, timeline } = await loadTimelineFromFile(getTimelinePath(storyName));
            return { durationInFrames: lengthFrames + INTRO_DURATION, props: { ...props, timeline } };
          }}
        />
      ))}
    </>
  );
};
