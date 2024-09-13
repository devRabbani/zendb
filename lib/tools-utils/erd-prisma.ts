import {
  parsePrismaSchema,
  type PrismaType,
  type SchemaDeclaration,
  type ModelDeclarationMember,
} from "@loancrate/prisma-schema-parser";

const NEED_SORT = ["||--||", "}o--o{"];

const getFieldTypeName = (type: PrismaType): string => {
  if (type.kind === "typeId") return type.name.value;
  if (type.type?.kind === "typeId") return type.type.name.value;
  return "";
};

const addRelationship = (
  relationships: Set<string>,
  model1: string,
  model2: string,
  relation: string
) => {
  const relationshipLabel = getRelationshipLabel(relation);
  if (NEED_SORT.includes(relation)) {
    relationships.add(
      `${[model1, model2].sort().join(` ${relation} `)}${relationshipLabel}`
    );
  } else {
    relationships.add(`${model1} ${relation} ${model2}${relationshipLabel}`);
  }
};

const getRelationshipLabel = (relation: string) => {
  const labels: Record<string, string> = {
    "}o--o{": ' : "many to many"',
    "||--o{": ' : "has many"',
    "}|--||": ' : "belongs to"',
    "||--||": ' : "has one"',
  };
  return labels[relation] || "";
};

const processField = (
  currentModel: string,
  field: ModelDeclarationMember & { kind: "field" },
  modelMap: Map<string, SchemaDeclaration & { kind: "model" }>,
  relationships: Set<string>
): string => {
  const relatedModelName = getFieldTypeName(field.type);
  const relatedModel = modelMap.get(relatedModelName);

  if (relatedModel) {
    const isListType = field.type.kind === "list";
    relatedModel.members
      .filter(
        (m): m is ModelDeclarationMember & { kind: "field" } =>
          m.kind === "field"
      )
      .forEach((relatedField) => {
        const currentFieldType = getFieldTypeName(relatedField.type);
        if (currentFieldType === currentModel) {
          const relation = determineRelation(
            isListType,
            relatedField.type.kind === "list"
          );
          addRelationship(
            relationships,
            currentModel,
            relatedModelName,
            relation
          );
        }
      });
    return "";
  } else {
    return `   ${field.name.value} ${relatedModelName}\n`;
  }
};

const determineRelation = (
  isCurrentListType: boolean,
  isRelatedListType: boolean
) => {
  if (isCurrentListType && isRelatedListType) return "}o--o{";
  if (isCurrentListType) return "||--o{";
  if (isRelatedListType) return "}|--||";
  return "||--||";
};

export default function generateERDFromPrisma(input: string): string {
  const parsedSchema = parsePrismaSchema(input);
  const mermaidCode: string[] = ["erDiagram"];
  const relationships: Set<string> = new Set();

  const modelMap = new Map(
    parsedSchema.declarations
      .filter(
        (d): d is SchemaDeclaration & { kind: "model" } => d.kind === "model"
      )
      .map((model) => [model.name.value, model])
  );

  modelMap.forEach((model, modelName) => {
    mermaidCode.push(`${modelName} {`);
    model.members
      .filter(
        (m): m is ModelDeclarationMember & { kind: "field" } =>
          m.kind === "field"
      )
      .forEach((field) => {
        const fieldCode = processField(
          modelName,
          field,
          modelMap,
          relationships
        );
        if (fieldCode) mermaidCode.push(fieldCode);
      });
    mermaidCode.push("}");
  });

  return [...mermaidCode, ...Array.from(relationships)].join("\n");
}
