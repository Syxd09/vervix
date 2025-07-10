import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md p-6 border">
      <div className="mb-6">
        <Title text1="CART" text2="TOTALS" />
      </div>

      <div className="flex flex-col gap-4 text-sm sm:text-base text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            {currency} {subtotal}.00
          </span>
        </div>
        <hr />
        <div className="flex justify-between">
          <span>Shipping Fee</span>
          <span>
            {currency} {delivery_fee}.00
          </span>
        </div>
        <hr />
        <div className="flex justify-between font-semibold text-base text-black">
          <span>Total</span>
          <span>
            {currency} {total}.00
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
