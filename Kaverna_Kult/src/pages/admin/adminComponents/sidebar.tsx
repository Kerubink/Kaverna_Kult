// src/components/layout/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl mb-6">Dashboard</h2>
      <ul>
        <li>
          <Link to="/admin/produtos" className="block py-2 px-4 hover:bg-gray-700 rounded">Produtos</Link>
        </li>
        <li>
          <Link to="/admin/pedidos" className="block py-2 px-4 hover:bg-gray-700 rounded">Pedidos</Link>
        </li>
        <li>
          <Link to="/admin/configuracoes" className="block py-2 px-4 hover:bg-gray-700 rounded">Configurações</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
