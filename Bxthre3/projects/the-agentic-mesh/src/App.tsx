import { BrowserRouter, Route, Routes } from "react-router-dom";
import ThemeProvider } from "@/components/theme-provider";
import OrchestrationDashboard from "./pages/orchestration-dashboard";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OrchestrationDashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
