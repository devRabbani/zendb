const parsedSchema: ParsedSchema = {
  declarations: [
    {
      kind: "model",
      name: { value: "User" },
      members: [
        {
          kind: "field",
          name: { value: "id" },
          type: { kind: "typeId", name: { value: "Int" } },
        },
        {
          kind: "field",
          name: { value: "name" },
          type: { kind: "typeId", name: { value: "String" } },
        },
        {
          kind: "field",
          name: { value: "email" },
          type: { kind: "typeId", name: { value: "String" } },
        },
        {
          kind: "field",
          name: { value: "posts" },
          type: { kind: "list", type: { name: { value: "Post" } } },
        },
      ],
    },
    {
      kind: "model",
      name: { value: "Post" },
      members: [
        {
          kind: "field",
          name: { value: "id" },
          type: { kind: "typeId", name: { value: "Int" } },
        },
        {
          kind: "field",
          name: { value: "title" },
          type: { kind: "typeId", name: { value: "String" } },
        },
        {
          kind: "field",
          name: { value: "content" },
          type: { kind: "optional", type: { name: { value: "String" } } },
        },
        {
          kind: "field",
          name: { value: "authorId" },
          type: { kind: "typeId", name: { value: "Int" } },
        },
        {
          kind: "field",
          name: { value: "author" },
          type: { kind: "typeId", name: { value: "User" } },
          attributes: [
            {
              path: { value: ["relation"] },
              args: [
                {
                  name: { value: "fields" },
                  expression: { items: [{ value: ["authorId"] }] },
                },
              ],
            },
          ],
        },
        {
          kind: "field",
          name: { value: "categories" },
          type: { kind: "list", type: { name: { value: "PostCategory" } } },
        },
      ],
    },
    {
      kind: "model",
      name: { value: "Category" },
      members: [
        {
          kind: "field",
          name: { value: "id" },
          type: { kind: "typeId", name: { value: "Int" } },
        },
        {
          kind: "field",
          name: { value: "name" },
          type: { kind: "typeId", name: { value: "String" } },
        },
        {
          kind: "field",
          name: { value: "posts" },
          type: { kind: "list", type: { name: { value: "PostCategory" } } },
        },
      ],
    },
    {
      kind: "model",
      name: { value: "PostCategory" },
      members: [
        {
          kind: "field",
          name: { value: "postId" },
          type: { kind: "typeId", name: { value: "Int" } },
        },
        {
          kind: "field",
          name: { value: "categoryId" },
          type: { kind: "typeId", name: { value: "Int" } },
        },
        {
          kind: "field",
          name: { value: "post" },
          type: { kind: "typeId", name: { value: "Post" } },
          attributes: [
            {
              path: { value: ["relation"] },
              args: [
                {
                  name: { value: "fields" },
                  expression: { items: [{ value: ["postId"] }] },
                },
              ],
            },
          ],
        },
        {
          kind: "field",
          name: { value: "category" },
          type: { kind: "typeId", name: { value: "Category" } },
          attributes: [
            {
              path: { value: ["relation"] },
              args: [
                {
                  name: { value: "fields" },
                  expression: { items: [{ value: ["categoryId"] }] },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
