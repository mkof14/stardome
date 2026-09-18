import type { EquipmentId } from "@/lib/equipment";

export type BridgeSessionValue = {
  scenarioName: string;
  riskLevel: string;
  vessel: string;
  scenarioId: string;
  panelType: string;
  actionText: string;
  recommended: string;
  logText: string;
  crisis: boolean;
  faultId: EquipmentId | null;
  live: boolean;
};
