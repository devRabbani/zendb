import toolNames from "@/lib/tools-utils/tool-names";
import { Button, buttonVariants } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import ArticlesCard from "./article-card";

const dbArticles = [
  {
    title: "10 Best Practices for Database Design",
    author: "Jane Doe",
    date: "2023-05-15",
  },
  {
    title: "Understanding Database Normalization",
    author: "John Smith",
    date: "2023-05-10",
  },
  {
    title: "Optimizing SQL Queries for Performance",
    author: "Alice Johnson",
    date: "2023-05-05",
  },
  {
    title: "Mastering Database Indexing",
    author: "Emma Wilson",
    date: "2023-05-01",
  },
  {
    title: "The Future of NoSQL Databases",
    author: "Michael Brown",
    date: "2023-04-28",
  },
  {
    title: "Data Modeling Techniques for Efficient Databases",
    author: "Sarah Lee",
    date: "2023-04-25",
  },
  {
    title: "Securing Your Database: Best Practices",
    author: "David Wang",
    date: "2023-04-22",
  },
  {
    title: "Optimizing Database Performance in Cloud Environments",
    author: "Lisa Chen",
    date: "2023-04-19",
  },
  {
    title: "Understanding ACID Properties in Database Transactions",
    author: "Robert Taylor",
    date: "2023-04-16",
  },
  {
    title: "Implementing Effective Backup and Recovery Strategies",
    author: "Emily Davis",
    date: "2023-04-13",
  },
];

export default function LatestArticles() {
  return (
    <div className="">
      <h2 className="font-semibold mb-4 text-lg border-b pb-1.5">
        Latest Articles about DB
      </h2>
      <div className="grid gap-3 md:grid-cols-1">
        {dbArticles.slice(0, 6).map((article, index) => (
          <ArticlesCard key={index} article={article} />
        ))}
      </div>

      <Link
        className={buttonVariants({
          variant: "outline",
          className: "mt-4 mx-auto w-24 text-center !block",
        })}
        href="/articles"
      >
        See All
      </Link>
    </div>
  );
}
