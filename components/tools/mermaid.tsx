"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const chart2 = `
  erDiagram
    Users {
        int id PK "Primary Key"
        string name
        string email "Unique"
        datetime created_at
    }

    Orders {
        int order_id PK "Primary Key"
        int user_id FK "Foreign Key"
        decimal amount
        datetime created_at
        int shipping_address_id FK "Foreign Key"
    }

    OrderItems {
        int order_item_id PK "Primary Key"
        int order_id FK "Foreign Key"
        int product_id FK "Foreign Key"
        int quantity
        decimal price
    }

    Products {
        int product_id PK "Primary Key"
        string product_name
        decimal price
        int stock_quantity
        int category_id FK "Foreign Key"
    }

    Categories {
        int id PK "Primary Key"
        string category_name
    }

    ProductReviews {
        int review_id PK "Primary Key"
        int product_id FK "Foreign Key"
        int user_id FK "Foreign Key"
        int rating
        string review_text
        datetime created_at
    }

    ShippingAddresses {
        int id PK "Primary Key"
        int user_id FK "Foreign Key"
        string address_line1
        string address_line2
        string city
        string state
        string postal_code
        string country
    }

    %% Relationships
    Users ||--o{ Orders : places
    Orders ||--o{ OrderItems : contains
    Products ||--o{ OrderItems : includes
    Users ||--o{ ProductReviews : writes
    Products ||--o{ ProductReviews : receives
    Products ||--o{ Categories : belongs_to
    Users ||--o{ ShippingAddresses : has
    Orders ||--|{ ShippingAddresses : ships_to

`;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded();
  }, [isMounted]);

  useEffect(() => {
    if (mermaidRef.current) {
      mermaid.render("mermaid-svg", chart).then((result) => {
        mermaidRef.current!.innerHTML = result.svg;
      });
    }
  }, [chart, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <div ref={mermaidRef} className="mermaid" />;
}
