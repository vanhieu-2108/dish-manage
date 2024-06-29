"use client";
import { useAppContext } from "@/components/app-provider";
import Link from "next/link";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu", // authRequired = undefined nghĩa là không cần đăng nhập cũng có thể xem
  },
  {
    title: "Đơn hàng",
    href: "/orders", // authRequired = undefined nghĩa là không cần đăng nhập cũng có thể xem
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false, // Khi false nghĩa là chưa đăng nhập thì sẽ hiển thị
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true, // Còn true nghĩa là đã đăng nhập thì mới hiển thị
  },
];

// Server: Món ăn, Đăng nhập. Do server biết trạng thái đăng nhập của user
// Client: Đầu tiên client sẽ hiển thị là món ăn, đăng nhập. Nhưng ngay sau đó render ra là món ăn, đơn hàng, quản lý do đã check được trạng thái đã đăng nhập

export default function NavItems({ className }: { className?: string }) {
  const { isAuth } = useAppContext();
  console.log("isAuth", isAuth);
  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isAuth) ||
      (item.authRequired === true && !isAuth)
    )
      return null;
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
