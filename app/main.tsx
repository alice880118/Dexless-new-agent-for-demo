import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IndexPage } from "./routes/_index";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IndexPage />
  </StrictMode>,
);
