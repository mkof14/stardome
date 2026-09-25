export type WatchParty = "captain" | "designated" | "watch" | "support";

export type WatchBearer =
  | "shipPhone"
  | "mobile"
  | "localPhone"
  | "personalRadio"
  | "vesselRadio"
  | "vhf"
  | "satcomVoice"
  | "starlinkMaritime"
  | "starlinkPriority"
  | "supportDesk"
  | "alarmNet";

export type WatchCircuit = {
  id: string;
  party: WatchParty;
  bearer: WatchBearer;
};

/** Watch circuits the officer can raise from StarDome 1. */
export const WATCH_CIRCUITS: WatchCircuit[] = [
  { id: "captain-ship-phone", party: "captain", bearer: "shipPhone" },
  { id: "captain-mobile", party: "captain", bearer: "mobile" },
  { id: "designated-local-phone", party: "designated", bearer: "localPhone" },
  { id: "designated-personal-radio", party: "designated", bearer: "personalRadio" },
  { id: "watch-vessel-radio", party: "watch", bearer: "vesselRadio" },
  { id: "watch-vhf", party: "watch", bearer: "vhf" },
  { id: "support-satcom", party: "support", bearer: "satcomVoice" },
  { id: "support-starlink-maritime", party: "support", bearer: "starlinkMaritime" },
  { id: "watch-starlink-priority", party: "watch", bearer: "starlinkPriority" },
  { id: "support-live-team", party: "support", bearer: "supportDesk" },
  { id: "watch-alarm", party: "watch", bearer: "alarmNet" },
];
