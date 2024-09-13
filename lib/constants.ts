export const FOREIGN_KEY_REGEX = /REFERENCES\s+(\w+)\s*(?:\((\w+)\)|(\w+))/i;

export const SAMPLE_SCHEMA = {
  prisma: `
model User {
  id      Int      @id @default(autoincrement())
  name    String
  email   String   @unique
  posts   Post[]
  profile Profile?
}

model Profile {
  id        Int      @id @default(autoincrement())
  content   String
  update_at DateTime @updatedAt
  create_at DateTime @default(now())
  userId    Int      @unique
  user      User     @relation(fields: [userId], references: [id])
}

model Post {
  id         Int            @id @default(autoincrement())
  title      String
  content    String?
  authorId   Int
  author     User           @relation(fields: [authorId], references: [id])
  categories Category[]
  tags       Tag[]
}

model Tag {
  id     Int    @id @default(autoincrement())
  name   String @unique
  postId Int
  post   Post   @relation(fields: [postId], references: [id])
}

model Category {
  id    Int     @id @default(autoincrement())
  name  String  @unique
  posts Post[]
}
`,
  simple: `User
id            Int     Primary Key
name          Text
email         Text    Unique
password_hash Text
created_at    DateTime
updated_at    DateTime

Post
id            Int     Primary Key
user_id       Int     Foreign Key references User id
title         Text
body          Text
created_at    DateTime
updated_at    DateTime

Comment
id            Int     Primary Key
post_id       Int     Foreign Key references Post(id)
user_id       Int     Foreign Key references User(id)
body          Text
created_at    DateTime
updated_at    DateTime
`,
};

export const COMPLEXITY_LABELS_SHORT = [
  "Table Count",
  "Avg Col/Table",
  "Total FK",
  "Max FK/Table",
  "Normalized",
];
