import { parsePrismaSchema } from "@loancrate/prisma-schema-parser";

interface Field {
  name: { value: string };
  type: {
    kind: string;
    name?: { value: string };
    type?: { name?: { value: string } };
  };
  attributes?: Array<{
    path: { value: string[] };
    args?: Array<{
      name?: { value: string };
      expression?: { items?: Array<{ value: string[] }> };
    }>;
  }>;
}

interface Model {
  name: { value: string };
  members: (Field | { kind: string })[];
}

interface ParsedSchema {
  declarations: Model[];
}

function generateERD(input: string): string {
  const parsedSchema = parsePrismaSchema(input);
  let mermaidCode = "erDiagram\n";
  const models: { [key: string]: string[] } = {};
  const relationships: Set<string> = new Set();
  const manyToManyRelations: Set<string> = new Set();

  // Extract models and fields
  parsedSchema.declarations
    .filter((decl) => decl.name && decl.members && decl.kind === "model")
    .forEach((model) => {
      const modelName = model.name.value;
      models[modelName] = [];

      model.members
        .filter((member) => member.kind === "field")
        .forEach((field: Field) => {
          const fieldName = field.name.value;
          let fieldType = field.type.name?.value || "String";

          // Exclude relationship fields
          if (!models[fieldType] && field.type.kind !== "list") {
            models[modelName].push(`${fieldType} ${fieldName}`);
          }
        });
    });

  // Generate model definitions
  Object.entries(models).forEach(([modelName, fields]) => {
    mermaidCode += `  ${modelName} {\n`;
    fields.forEach((field) => {
      mermaidCode += `    ${field}\n`;
    });
    mermaidCode += "  }\n";
  });

  // Determine relationships
  parsedSchema.declarations
    .filter((decl) => decl.name && decl.members && decl.kind === "model")
    .forEach((model) => {
      const modelName = model.name.value;

      model.members
        .filter((member) => member.kind === "field")
        .forEach((field: Field) => {
          const fieldName = field.name.value;
          const fieldType =
            field.type.name?.value || field.type.type?.name?.value;
          const isList = field.type.kind === "list";

          if (fieldType && models[fieldType]) {
            const relationAttribute = field.attributes?.find(
              (attr) => attr.path.value[0] === "relation"
            );
            if (relationAttribute) {
              if (isList) {
                // Many-to-Many relationship
                manyToManyRelations.add(`${modelName}|${fieldType}`);
              } else {
                // Many-to-One relationship
                relationships.add(
                  `  ${fieldType} ||--o{ ${modelName} : "has many"`
                );
                relationships.add(
                  `  ${modelName} }|--|| ${fieldType} : "belongs to"`
                );
              }
            } else if (isList) {
              // One-to-Many relationship
              relationships.add(
                `  ${modelName} ||--o{ ${fieldType} : "has many"`
              );
              relationships.add(
                `  ${fieldType} }|--|| ${modelName} : "belongs to"`
              );
            }
          }
        });
    });

  // Process many-to-many relationships
  manyToManyRelations.forEach((relation) => {
    const [model1, model2] = relation.split("|");
    relationships.add(`  ${model1} }o--o{ ${model2} : "has many"`);
  });

  // Add relationships to Mermaid code
  mermaidCode += Array.from(relationships).join("\n");

  return mermaidCode;
}

export default generateERD;
