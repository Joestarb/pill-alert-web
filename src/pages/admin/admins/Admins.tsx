import React, { useState } from "react";
import AdminsTable from "./components/AdminsTable";
import InsertAdminModal from "./components/InsertAdminModal";
import EditAdminModal from "./components/EditAdminModal";
import Button from "../../../components/common/Button";

const Admins: React.FC = () => {
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Administradores</h1>
        <Button onClick={() => setShowInsertModal(true)} type={"button"} disabled={false} variant={"primary"}>Agregar Admin</Button>
      </div>
      <AdminsTable onEdit={setEditAdmin} />
      <InsertAdminModal
        open={showInsertModal}
        onClose={() => setShowInsertModal(false)}
      />
      {editAdmin && (
        <EditAdminModal admin={editAdmin} onClose={() => setEditAdmin(null)} />
      )}
    </div>
  );
};

export default Admins;
