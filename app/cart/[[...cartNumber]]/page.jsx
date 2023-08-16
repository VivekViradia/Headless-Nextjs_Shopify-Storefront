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
  console.log("Cart ID", id);
  return (
    <div>
      <div>
        <h3>Cart Page</h3>
        <Cart />
      </div>
      <div>{/* <h2>value :{value}</h2> */}</div>
    </div>
  );
};

export default CartPage;
