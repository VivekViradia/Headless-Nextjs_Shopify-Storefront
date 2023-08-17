"use client";
import Cart from "@/components/Cart";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const CartPage = () => {
  // const router = useRouter();
  // const cartID = router.query;
  // console.log("Router", cartID);
  // const searchParams = useSearchParams();
  // console.log("searchParams", searchParams);

  const searchParams = useSearchParams();

  const id = searchParams.get("cartNumber");
  const cartID = "gid://shopify/Cart/" + id;
  // console.log("Cart ID", "gid://shopify/Cart/" + id);
  // console.log("Cart ID mutation", cartID);
  return (
    <div>
      <Cart cartID={cartID} />
    </div>
  );
};

export default CartPage;
