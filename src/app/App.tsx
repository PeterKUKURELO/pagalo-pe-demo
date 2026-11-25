import { RouterProvider } from "react-router";
import { PaymentProvider } from "./PaymentContext";
import { router } from "./routes";

export default function App() {
  return (
    <PaymentProvider>
      <RouterProvider router={router} />
    </PaymentProvider>
  );
}
