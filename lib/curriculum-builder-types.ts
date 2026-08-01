import type { Bi } from "./content";
import type { GateDecision } from "./curriculum";

export type TrifectaPillar = "Physical" | "Technical" | "Cognitive";
export type LearningDomain = "Cognitive" | "Psychomotor" | "Affective";

export type LevelEntity = {
  id: string;
  name: Bi;
  purpose: Bi;
  targetAudience: Bi;
  prerequisites: Bi;
  expectedPerformanceLevel: Bi;
  stationIds: string[];
  progressionLogic: Bi;
  entryCriteria: Bi;
  completionCriteria: Bi;
  evidenceExpectations: Bi;
  estimatedDuration: Bi;
  instructorNotes: Bi;
  updatedAt: string;
};

export type StationEntity = {
  id: string;
  levelId: string;
  name: Bi;
  purpose: Bi;
  requirement: Bi;
  domain: LearningDomain;
  level: string;
  primaryPillar: TrifectaPillar;
  secondaryPillar: TrifectaPillar;
  baseline: Bi;
  variables: Bi;
  timePressure: Bi;
  cognitiveLoad: Bi;
  physicalLoad: Bi;
  behaviour: Bi;
  checklist: Bi;
  criticalFailures: Bi;
  standard: Bi;
  dataToCollect: Bi;
  aarQuestions: Bi;
  remediation: Bi;
  retestRule: Bi;
  safetyGate: boolean;
  drillIds: string[];
  gateId: string;
  updatedAt: string;
};

export type DrillEntity = {
  id: string;
  stationId: string;
  title: Bi;
  purpose: Bi;
  objective: Bi;
  condition: Bi;
  standard: Bi;
  domain: LearningDomain;
  primaryPillar: TrifectaPillar;
  physicalRequirement: Bi;
  technicalRequirement: Bi;
  cognitiveRequirement: Bi;
  requiredEquipment: Bi;
  instructorActions: Bi;
  learnerActions: Bi;
  safetyControls: Bi;
  criticalFailures: Bi;
  evidenceToCollect: Bi;
  assessmentMethod: Bi;
  repetitionsOrDuration: Bi;
  remediationOptions: Bi;
  completionCriteria: Bi;
  pillarWeights: {
    physical: number; // 0 to 100
    technical: number;
    cognitive: number;
  };
  updatedAt: string;
};

export type GateEntity = {
  id: string;
  fromStationId: string;
  nextStationId?: string;
  requirement: Bi;
  evidenceRequired: Bi;
  mandatoryCriteria: Bi;
  criticalFailures: Bi;
  goConditions: Bi;
  noGoConditions: Bi;
  needMoreDataConditions: Bi;
  remediation: Bi;
  retestRequirements: Bi;
  resetConditions: Bi;
  decisionRationale: Bi;
  nextPermittedAction: Bi;
  decision: GateDecision;
  decisionEvidence: string;
  updatedAt: string;
};

export type CurriculumSuiteStore = {
  schemaVersion: 3;
  activeTab: "level" | "station" | "drill" | "gate";
  activeLevelId: string;
  activeStationId: string;
  activeDrillId: string;
  activeGateId: string;
  levels: LevelEntity[];
  stations: StationEntity[];
  drills: DrillEntity[];
  gates: GateEntity[];
  unknownLegacyFields?: Record<string, unknown>;
};

export type ImportValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
  importedStore?: CurriculumSuiteStore;
};

export type CycleCheckResult = {
  hasCycle: boolean;
  cyclePath: string[];
};
