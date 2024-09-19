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

export const RESOURCES = [
  {
    tags: ["articles"],
    title: "11 Database Optimization Techniques",
    short_description:
      "Database often becomes the bottleneck in software performance. Having an optimized database is essential for high-performing systems. Here are 11 effective database optimization techniques.",
    link: "https://danielfoo.medium.com/11-database-optimization-techniques-97fdbed1b627",
  },
  {
    tags: ["course", "free"],
    title: "PlanetScale - MySQL for Developers",
    short_description:
      "An in-depth course teaching the fundamentals of MySQL, specifically tailored for developers looking to optimize their database usage. Best optimization course for MySQL database.",
    link: "https://planetscale.com/learn/courses/mysql-for-developers",
  },
  {
    tags: ["youtube", "free"],
    title: "Fireship YouTube Channel",
    short_description:
      "If you love NoSQL databases, especially Firebase, then Fireship is the best YouTube channel for you. It also covers other databases and frontend topics in concise, educational videos.",
    link: "https://www.youtube.com/@Fireship",
  },
  {
    tags: ["course", "free"],
    title: "Stanford Online - Relational Databases and SQL",
    short_description:
      "A Stanford course offering in-depth knowledge of relational databases and SQL, exploring database structure, querying, and optimization techniques.",
    link: "https://online.stanford.edu/courses/soe-ydatabases0005-databases-relational-databases-and-sql",
  },

  {
    tags: ["course"],
    title: "Meta Database Engineer Professional Certificate (Coursera)",
    short_description:
      "A professional certification from Meta on Coursera focusing on database engineering, SQL, and other optimization techniques.",
    link: "https://www.coursera.org/professional-certificates/meta-database-engineer",
  },

  {
    tags: ["course", "free"],
    title: "PlanetScale - Database Scaling",
    short_description:
      "A course covering database scaling techniques including partitioning, sharding, and load distribution for scalable database systems.",
    link: "https://planetscale.com/learn/courses/database-scaling/introduction/course-introduction",
  },
  {
    tags: ["docs"],
    title: "Prisma Documentation - Getting Started",
    short_description:
      "Because why not? Prisma is trending and offers excellent documentation on optimization, schema design, relations, and more for Node.js and TypeScript developers.",
    link: "https://www.prisma.io/docs/getting-started",
  },
  {
    tags: ["youtube", "free"],
    title: "Joey Blue YouTube Channel",
    short_description:
      "Joey Blue's channel provides tutorials and insights into databases, SQL optimization, and related technical topics. The best channel to learn databases.",
    link: "https://www.youtube.com/@joeyblue1/videos",
  },
  {
    tags: ["articles"],
    title: "SQLShack - Database Optimization and News",
    short_description:
      "SQLShack provides a range of blogs about databases, optimization techniques, and the latest news in the database world.",
    link: "https://www.sqlshack.com/",
  },
  {
    tags: ["course", "free"],
    title: "DataCamp - Databases and SQL",
    short_description:
      "A comprehensive learning platform offering courses on databases, SQL, and related topics for data enthusiasts.",
    link: "https://www.datacamp.com/",
  },
];

export const QUERY_LABELS_SHORT = {
  JOINs: "JOIN",
  Subqueries: "SUBQRY",
  Aggregations: "AGGR",
  DISTINCT: "DIST",
  "ORDER BY": "ORDER",
  HAVING: "HAVING",
  "GROUP BY": "GROUP",
  "Set Operations": "SET",
  "Window Functions": "WF",
  CTEs: "CTE",
  "WHERE Clause": "WHERE",
};
