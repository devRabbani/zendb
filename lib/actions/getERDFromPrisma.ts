import { parsePrismaSchema, PrismaType } from "@loancrate/prisma-schema-parser";

const getFieldTypeName = (type: PrismaType) => {
  return type.kind === "typeId"
    ? type.name.value
    : type.type.kind === "typeId"
    ? type.type.name.value
    : "";
};
export default async function generateERDFromPrisma(input: string) {
  const parsedSchema = parsePrismaSchema(input);
  let mermaidCode = "erDiagram\n";
  const relationships: Set<string> = new Set();

  // Generate Diagram
  parsedSchema.declarations.forEach((d) => {
    if (d.kind === "model") {
      const currentModel = d.name.value;
      mermaidCode += `${currentModel}{\n`;
      d.members.forEach((m) => {
        if (m.kind === "field") {
          const relatedModelName = getFieldTypeName(m.type);
          const relatedModel = parsedSchema.declarations.find(
            (d2) => d2?.name?.value === relatedModelName
          );
          if (relatedModel?.kind === "model") {
            if (m.type.kind === "list") {
              relatedModel.members.forEach((m2) => {
                if (m2.kind === "field") {
                  const currentFieldType = getFieldTypeName(m2.type);
                  if (currentFieldType === currentModel) {
                    if (m2.type.kind === "list") {
                      relationships.add(
                        [currentModel, relatedModelName]
                          .sort()
                          .join(" }o--o{ ") + `: "many to many"`
                      );
                    } else {
                      relationships.add(
                        `${currentModel} ||--o{ ${relatedModelName}: "has many"`
                      );
                    }
                  }
                }
              });
            } else {
              relatedModel.members.forEach((m2) => {
                if (m2.kind === "field") {
                  const currentFieldType = getFieldTypeName(m2.type);
                  if (currentFieldType === currentModel) {
                    if (m2.type.kind === "list") {
                      relationships.add(
                        `${currentModel} }|--|| ${relatedModelName}: "belongs to"`
                      );
                    } else {
                      relationships.add(
                        [currentModel, relatedModelName]
                          .sort()
                          .join(" ||--|| ") + ` : "has one"`
                      );
                    }
                  }
                }
              });
            }
          } else {
            mermaidCode += `   ${m.name.value} ${relatedModelName}\n`;
          }
        }
      });
      mermaidCode += `}\n`;
    }
  });
  // Add relationships to Mermaid code
  mermaidCode += Array.from(relationships).join("\n");

  return mermaidCode;
}
