import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { StartClient } from "@tanstack/react-start/client";

createRoot(document).render(
  <StrictMode>
    <StartClient />
  </StrictMode>
);
