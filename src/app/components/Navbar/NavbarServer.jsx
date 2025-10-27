"use client";

import NavbarClient from "./pageClient";

export default function NavbarServer({ menus, marcas }) {
  return <NavbarClient menus={menus} marcas={marcas} />;
}
