// src/pages/Admin/Dashboard.tsx
import React from "react";
import Sidebar from "@/pages/admin/adminComponents/sidebar";  // Sidebar com links
import { Outlet } from "react-router-dom";  // Para renderizar as páginas internas

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">
        <Outlet />  {/* Exibe o conteúdo da página selecionada */}
      </div>
    </div>
  );
};

export default Dashboard;
