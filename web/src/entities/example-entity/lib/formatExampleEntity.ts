import type { ExampleEntity } from "../model/types";

export function formatExampleEntity(entity: ExampleEntity) {
  const statusLabel =
    entity.status === "active"
      ? "Ready for consumption"
      : entity.status === "inactive"
        ? "Draft / inactive"
        : "Needs attention";

  return `${entity.name} • ${statusLabel} • Updated ${entity.updatedAt}`;
}
