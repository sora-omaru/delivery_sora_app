import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function RestaurantCard() {
  return (
    <div className="relative">
      <Link href="/abn" className="inset-0 absolute z-10"></Link>
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image
          className="object-cover"
          src={"/no_image.png"}
          fill
          alt="レストラン画像"
          sizes="(max-width:1280px ) 25%,280px"
          // priority
          //LCPの警告があるがこちらを適応してしまうと、map関数で回している関係上、かえって読み込みが遅くなってしまう。そのため今回は無視する。
        />
      </div>
      <div className="flex justify-between items-center">
        <p className="bold">name</p>

        <div className="z-20">
          <Heart className="hover:fill-red-500 hover:stroke-0" />
        </div>
      </div>
    </div>
  );
}
