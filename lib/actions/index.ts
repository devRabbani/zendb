"use server";

import { parseSchema } from "../schema-tool-utils";

export const getSimpleSchema = (schema: string) => {
  const tables = parseSchema(schema);
  return tables;
};

type Relationship = {
  from: string;
  to: string;
  type: string;
  label: string;
};

function generateFromTextSchema(schema: string): string {
  const lines = schema.split("\n").map((line) => line.trim());
  const models = new Map<string, Set<string>>();
  const relationships = new Map<string, Relationship>();

  let currentModel = "";
  let mermaidSyntax = "erDiagram\n";

  lines.forEach((line) => {
    if (line.endsWith("{")) {
      currentModel = line.slice(0, -1).trim();
      models.set(currentModel, new Set());
      mermaidSyntax += `  ${currentModel} {\n`;
    } else if (line === "}") {
      currentModel = "";
      mermaidSyntax += "  }\n";
    } else if (currentModel && line) {
      const [fieldName, fieldType] = line.split(":").map((s) => s.trim());
      models.get(currentModel)?.add(fieldName);

      const isPrimaryKey = fieldName.toLowerCase().includes("id");
      const isForeignKey = fieldType.includes("FK");

      mermaidSyntax += `    ${fieldType.replace("FK", "")} ${fieldName}${
        isPrimaryKey ? " PK" : ""
      }${isForeignKey ? " FK" : ""}\n`;

      if (isForeignKey) {
        const relatedModel = fieldType.replace("FK", "").trim();
        addTextRelationship(
          currentModel,
          relatedModel,
          fieldName,
          models,
          relationships
        );
      }
    }
  });

  mermaidSyntax += Array.from(relationships.values())
    .map((rel) => `  ${rel.from} ${rel.type} ${rel.to} : "${rel.label}"`)
    .join("\n");

  return mermaidSyntax;
}

function addTextRelationship(
  modelName: string,
  relatedModel: string,
  fieldName: string,
  models: Map<string, Set<string>>,
  relationships: Map<string, Relationship>
) {
  const relationKey = [modelName, relatedModel].sort().join("-");
  if (!relationships.has(relationKey)) {
    if (fieldName.endsWith("s")) {
      relationships.set(relationKey, {
        from: modelName,
        to: relatedModel,
        type: "||--o{",
        label: "has many",
      });
    } else {
      relationships.set(relationKey, {
        from: modelName,
        to: relatedModel,
        type: "}o--||",
        label: "belongs to",
      });
    }
  }
}
