import { createBrowserRouter } from "react-router";
import { Root } from "./components";
import { Cart, Comparison, Confirmation, Home, NotFound, Register, Tickets } from "./pages";

export const router = createBrowserRouter([
  {
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "registro", Component: Register },
      { path: "carrito", Component: Cart },
      { path: "tickets", Component: Tickets },
      { path: "confirmacion", Component: Confirmation },
      { path: "comparativa", Component: Comparison },
      { path: "*", Component: NotFound },
    ],
  },
]);
