"use client";

import React from "react";
import { CategoryType } from "./categories";
import Image from "next/image";
import { cn } from "@/lib/utils";
interface CategoryProps {
  category: CategoryType;
  onClick: (category: string) => void;
  select: boolean;
}
//カテゴリーメニューを表示する
export default function Category({ category, onClick, select }: CategoryProps) {
  return (
    <div className="cursor-pointer" onClick={() => onClick(category.type)}>
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-full",
          select && "bg-green-200"
        )}
      >
        <Image
          className="object-cover scale-75"
          src={category.imageUrl}
          fill
          alt={category.categoryName}
          sizes="(max-width: 1280px) 10vw, 97px"
        />
      </div>
      <div className="mt-2 text-center ">
        <p className="text-xs truncate">{category.categoryName}</p>
      </div>
    </div>
  );
}
