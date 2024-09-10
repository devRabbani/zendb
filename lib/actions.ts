"use server";

import { formatAst, parsePrismaSchema } from "@loancrate/prisma-schema-parser";
import { log } from "console";

export const getPrismaSchema = async (input: string) => {
  const output = parsePrismaSchema(input);
  let mermaidSyntax: string = "erDiagram\n";
  const relationships = new Map();
  const models = new Map();

  // Setting Up The models and fileds
  output.declarations.forEach((declaration) => {
    if (declaration.kind === "model") {
      models.set(
        declaration.name.value,
        new Set(
          declaration.members
            .filter((member) => member.kind === "field")
            .map((member) => member.name.value)
        )
      );
    }
  });

  // Generate Diagram
  output.declarations.forEach((declaration) => {
    if (declaration.kind === "model") {
      const modelName = declaration.name.value;
      mermaidSyntax += `  ${modelName} {\n`;
      declaration.members.forEach((member) => {
        if (member.kind === "field") {
          const fieldType =
            member.type.name?.value || member.type.type?.name?.value;

          // Field Skipping that defines relationship
          if (!models.has(fieldType) && member.type.kind !== "list") {
            mermaidSyntax += `       ${fieldType} ${member.name.value}\n`;
          }

          if (member.type.kind === "list") {
            const relatedModel = fieldType;

            if (models.has(relatedModel)) {
              const relationKey = [modelName, relatedModel].sort().join("-"); //Sorting make unique

              // Checking if the relationship already exists
              if (!relationships.has(relationKey)) {
                // Many to Many relationship check
                if (
                  models.get(relatedModel).has(modelName.toLowerCase() + "s")
                ) {
                  relationships.set(
                    relationKey,
                    `  ${modelName} }o--o{ ${relatedModel} : "belongs to many"`
                  );
                } else {
                  relationships.set(
                    relationKey,
                    `  ${modelName} ||--o{ ${relatedModel} : "has many"`
                  );
                }
              }
            }
          } else if (models.has(fieldType)) {
            const relationKey = [modelName, fieldType].sort().join("-"); //Sorting make unique

            //   Checking wheter its already exist
            if (!relationships.has(relationKey)) {
              //   One to One relationship check
              if (models.get(fieldType).has(modelName.toLowerCase())) {
                relationships.set(
                  relationKey,
                  `  ${modelName} ||--|| ${fieldType} : "has one"`
                );
              } else {
                relationships.set(
                  relationKey,
                  `  ${modelName} }o--|| ${fieldType} : "belongs to"`
                );
              }
            }
          }
        }
      });
      mermaidSyntax += "  }\n";
    }
  });

  mermaidSyntax += Array.from(relationships.values()).join("\n");
  return mermaidSyntax;
};
