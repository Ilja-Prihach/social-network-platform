export type ExampleEntityStatus = "active" | "inactive" | "flagged";

export type ExampleEntity = {
  id: string;
  name: string;
  status: ExampleEntityStatus;
  updatedAt: string;
};
