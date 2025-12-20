import type { ExampleFeatureTone } from "../model/types";

const toneCopy: Record<ExampleFeatureTone, string> = {
  informational: "Stub feature ready to be wired into your workflow.",
  success: "All good — replace with your happy-path flow.",
  warning: "Replace with validation, edge cases, or error handling.",
};

export function getExampleMessage(description: string, tone: ExampleFeatureTone) {
  const note = toneCopy[tone] ?? toneCopy.informational;
  return `${description} ${note}`;
}
