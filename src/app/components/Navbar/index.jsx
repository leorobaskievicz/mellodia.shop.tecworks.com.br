// import NavbarServer from "./NavbarServer";

// export default function Navbar({ menus, marcas }) {
//   return <NavbarServer menus={menus} marcas={marcas} />;
// }

import NavbarClient from "./pageClient";

export default function NavbarServer({ menus, marcas }) {
  return <NavbarClient menus={menus} marcas={marcas} />;
}
