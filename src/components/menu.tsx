
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bookmark, HeartPlus, Menu } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/(auth)/login/actions";

export default async function MenuSheet() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { avatar_url, full_name } = user.user_metadata;
  //確認用のコンソール
  //   console.log(user)
  return (
    //shadcn/uiを使用したシート類sheetで検索するとでてくるもの
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-5">
          <SheetHeader className="sr-only">
            {/* 現在ここは表示しないようにしている。そうしないとエラーが起きる */}
            <SheetTitle>メニュー情報</SheetTitle>
            <SheetDescription>
              ユーザー情報とメニュー情報を表示
            </SheetDescription>
          </SheetHeader>
          {/* ユーザー情報を表示する場所 */}
          <div className="flex items-center gap-5">
            <Avatar>
              <AvatarImage src={avatar_url} />
              {/* こちらはユーザー名が表示できなかった用のもの */}
              <AvatarFallback>ユーザー名</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold">{full_name}</div>
              <div>
                <Link href={"#"} className="text-green-500 text-xs">
                  アカウントを管理する
                </Link>
              </div>
            </div>
          </div>

          {/* メニューエリア
           */}
          <ul className="space-y-4">
            <li>
              <Link href={"orders"} className="flex items-center gap-4">
                <Bookmark fill="bg-primal" />
                <span className="font-bold">ご注文内容</span>
              </Link>
            </li>
            <li>
              <Link href={"favorites"} className="flex items-center gap-4">
                <HeartPlus />
                <span className="font-bold">お気に入り</span>
              </Link>
            </li>
          </ul>
          <SheetFooter>
            <form>
              <Button className="w-full" formAction={logout}>ログアウト</Button>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
