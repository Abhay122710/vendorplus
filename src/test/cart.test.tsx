import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { CartProvider, useCart } from "@/lib/cart-context";
import { Product } from "@/lib/demo-data";

const mockProductA: Product = {
  id: "p1",
  shop_id: "s1",
  product_name: "Fresh Milk",
  category: "Dairy",
  price: 60,
  unit: "litre",
  stock: 20,
  created_at: new Date().toISOString(),
};

const mockProductB: Product = {
  id: "p2",
  shop_id: "s1",
  product_name: "Brown Bread",
  category: "Bakery",
  price: 45,
  unit: "packet",
  stock: 15,
  created_at: new Date().toISOString(),
};

const mockProductDifferentShop: Product = {
  id: "p3",
  shop_id: "s2",
  product_name: "Apples",
  category: "Fruits",
  price: 120,
  unit: "kg",
  stock: 10,
  created_at: new Date().toISOString(),
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe("Cart Context & Operations", () => {
  it("initializes with an empty cart and zero total", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.shopId).toBeNull();
  });

  it("adds an item to cart and updates subtotal", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProductA, "s1");
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].product.id).toBe("p1");
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.total).toBe(60);
    expect(result.current.shopId).toBe("s1");
  });

  it("increments quantity when adding duplicate item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProductA, "s1");
      result.current.addItem(mockProductA, "s1");
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.total).toBe(120);
  });

  it("calculates multi-product subtotal accurately", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProductA, "s1"); // 60 * 1 = 60
      result.current.addItem(mockProductB, "s1"); // 45 * 1 = 45
      result.current.addItem(mockProductB, "s1"); // 45 * 2 = 90
    });

    expect(result.current.items.length).toBe(2);
    expect(result.current.total).toBe(150); // 60 + 90
  });

  it("enforces single-shop cart constraint by resetting when a different shop product is added", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProductA, "s1");
    });
    expect(result.current.shopId).toBe("s1");

    act(() => {
      result.current.addItem(mockProductDifferentShop, "s2");
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].product.id).toBe("p3");
    expect(result.current.shopId).toBe("s2");
    expect(result.current.total).toBe(120);
  });

  it("updates quantity directly and removes item when quantity is set to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProductA, "s1");
      result.current.updateQuantity("p1", 5);
    });
    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.total).toBe(300);

    act(() => {
      result.current.updateQuantity("p1", 0);
    });
    expect(result.current.items.length).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it("removes an item explicitly and clears cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProductA, "s1");
      result.current.addItem(mockProductB, "s1");
    });
    expect(result.current.items.length).toBe(2);

    act(() => {
      result.current.removeItem("p1");
    });
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].product.id).toBe("p2");

    act(() => {
      result.current.clearCart();
    });
    expect(result.current.items.length).toBe(0);
    expect(result.current.total).toBe(0);
  });
});
