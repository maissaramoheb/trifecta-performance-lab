import type { Bi } from "./content";
import type { GateDecision } from "./curriculum";

export type TrifectaPillar = "Physical" | "Technical" | "Cognitive";
export type LearningDomain = "Cognitive" | "Psychomotor" | "Affective";

export type ObservedCriticalFailure = {
  id: string;
  observedAt: string;
  evidence: string;
  description?: Bi | string;
};

export type GateAttempt = {
  id: string;
  gateId: string;
  attemptNumber: number;
  timestamp: string;
  evidenceSnapshot: string;
  observedCriticalFailures: ObservedCriticalFailure[];
  decision: GateDecision;
  rationale: Bi | string;
  remediation: Bi | string;
  assessorNotes?: string;
};

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
  legacyExtensions?: Record<string, unknown>;
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
  legacyExtensions?: Record<string, unknown>;
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
  criticalFailureCriteria: Bi;
  observedCriticalFailures: ObservedCriticalFailure[];
  rating: number | null;
  ambiguousRating?: boolean;
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
  legacyExtensions?: Record<string, unknown>;
};

export type GateEntity = {
  id: string;
  fromStationId: string;
  nextStationId?: string;
  requirement: Bi;
  evidenceRequired: Bi;
  mandatoryCriteria: Bi;
  criticalFailures: Bi;
  criticalFailureCriteria: Bi;
  observedCriticalFailures: Array<string | ObservedCriticalFailure>;
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
  attempts: GateAttempt[];
  updatedAt: string;
  legacyExtensions?: Record<string, unknown>;
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
  legacyExtensions?: Record<string, unknown>;
};

export type ValidationError = {
  code: string;
  messageKey?: string;
  params?: Record<string, string | number>;
  path?: string;
  textAr?: string;
  textEn?: string;
};

export type ImportValidationResult = {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  rawErrors?: string[];
  importedStore?: CurriculumSuiteStore;
};

export type CycleCheckResult = {
  hasCycle: boolean;
  cyclePath: string[];
};
