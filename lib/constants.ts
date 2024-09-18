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

export const SAMPLE_QUERIES = [
  {
    name: "Simple SELECT",
    query: "SELECT * FROM users WHERE age > 18",
  },
  {
    name: "JOIN with GROUP BY",
    query:
      "SELECT u.name, COUNT(o.id) as order_count FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id",
  },
  {
    name: "Complex Query",
    query: `WITH ranked_orders AS (
  SELECT user_id, COUNT(*) as order_count,
  RANK() OVER (ORDER BY COUNT(*) DESC) as user_rank
  FROM orders
  GROUP BY user_id
)
SELECT u.name, r.order_count, r.user_rank
FROM users u
JOIN ranked_orders r ON u.id = r.user_id
WHERE r.user_rank <= 10
ORDER BY r.user_rank`,
  },
];

export const COMMON_TYPES = [
  { label: "Email", placeholder: "example@email.com" },
  { label: "Website", placeholder: "https://www.example.com" },
  { label: "Date", placeholder: "2023-05-15" },
  { label: "Time", placeholder: "14:30:00" },
  { label: "Number", placeholder: "42" },
  { label: "Boolean", placeholder: "1" },
  { label: "JSON", placeholder: '{"key": "value"}' },
];

export const RSS_FEEDS = [
  "https://dev.to/feed/tag/database",
  "https://medium.com/feed/tag/database",
  "https://www.sqlshack.com/feed/",
  "https://hashnode.com/n/databases/rss",
];

export const BACKUP_TIPS = [
  "Always backup your database before making major changes.",
  "Use indexes to improve query performance on frequently accessed columns.",
  "Normalize your database to reduce data redundancy and improve data integrity.",
  "Regularly update your database software to ensure security and performance.",
  "Use prepared statements to prevent SQL injection attacks.",
];
