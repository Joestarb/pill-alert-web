import React, { useState } from "react";
import Button from "../../../components/common/Button";
import { Modal } from "../../../components/ui/modal";
import RegisterUsers from "./components/RegisterUsers";
const Register: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <Button onClick={openModal}  type={"button"} disabled={false} variant={"primary"}>Abrir Modal</Button>
      <Modal isOpen={isModalOpen} onClose={closeModal} children={
        <div className="container mx-auto p-4">
          <p>hola mundo</p>
        </div>
        } />

        <RegisterUsers/>
    </div>
  );
};

export default Register;
