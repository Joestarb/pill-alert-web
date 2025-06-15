import React, { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";
import Alert from "../../../../components/ui/alert/Alert";
import { Modal } from "../../../../components/ui/modal";
import { useUpdateGroupsMutation } from "../../../../services/GroupSupabase";

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: { group_id: number; group_name: string } | null;
  refetchGroups?: () => void;
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({
  isOpen,
  onClose,
  group,
  refetchGroups,
}) => {
  const [form, setForm] = useState({
    group_name: group?.group_name || "",
  });
  const [updateGroup, { isLoading, error, isSuccess }] =
    useUpdateGroupsMutation();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [pendingAlert, setPendingAlert] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);

  useEffect(() => {
    setForm({ group_name: group?.group_name || "" });
    setAlertMessage("");
    setAlertType("success");
    setPendingAlert(null);
  }, [group, isOpen]);

  useEffect(() => {
    if (!isOpen && pendingAlert) {
      setAlertType(pendingAlert.type);
      setAlertMessage(pendingAlert.message);
      setPendingAlert(null);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }, [isOpen, pendingAlert]);

    useEffect(() => {
      if (showAlert) {
        const timer = setTimeout(() => setShowAlert(false), 5000);
        return () => clearTimeout(timer);
      }
    }, [showAlert]);
  useEffect(() => {
    if (isSuccess) {
      setPendingAlert({
        type: "success",
        message: "Grupo actualizado correctamente",
      });
      if (typeof refetchGroups === "function") refetchGroups();
      onClose();
    } else if (error) {
      setPendingAlert({
        type: "error",
        message: "Error al actualizar el grupo",
      });
    }
  }, [isSuccess, error, onClose, refetchGroups]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      setShowAlert(true);
    e.preventDefault();
    if (group) {
      await updateGroup({
        group_id: group.group_id,
        group_name: form.group_name,
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="group_name"
            label="Nombre del Grupo"
            value={form.group_name}
            onChange={handleChange}
            required={true}
            type="text"
            placeholder="Nombre del grupo"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={false}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
      {showAlert && (
        <div
          className="fixed bottom-6 right-6 z-50 cursor-pointer"
          onClick={() => setShowAlert(false)}
        >
          <Alert
            variant={alertType}
            title={alertType === "success" ? "Éxito" : "Error"}
            message={alertMessage}
          />
        </div>
      )}
    </>
  );
};

export default EditGroupModal;
