import BreadcrumbHelper from "@/components/breadcrumb-helper";
import ArticlesCard from "@/components/home/article-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

export default function ArticlesPage() {
  return (
    <section>
      <BreadcrumbHelper pageName="Articles" />
      <h2 className="mt-6 font-semibold mb-4 text-lg border-b pb-1.5">
        Latest Articles about DB
      </h2>
      <div className="grid gap-3 md:grid-cols-1">
        {dbArticles.map((article, index) => (
          <ArticlesCard key={index} article={article} />
        ))}
      </div>
    </section>
  );
}
