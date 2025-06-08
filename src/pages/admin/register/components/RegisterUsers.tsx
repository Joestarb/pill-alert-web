import React, { useEffect, useState } from "react";
import { User } from "../../../../interfaces/api/userInterface";
import { getUsers } from "../../../../services/get_users";
import UsersTable from "./UsersTable";
const RegisterUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const handleGetUsers = async () => {
    try {
      const usersData = await getUsers();
      // Normalizar la estructura para que roles y user_groups sean objetos
      const normalized = usersData.map((user: any) => ({
        ...user,
        roles: Array.isArray(user.roles) ? user.roles[0] : user.roles,
        user_groups: Array.isArray(user.user_groups)
          ? user.user_groups[0]
          : user.user_groups,
      }));
      setUsers(normalized);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  // Determinar si hay algún usuario que NO sea enfermero
  const showDeviceIp = users.some(
    (user) => user.roles.role_name !== "enfermero"
  );

  return (
    <div>
      <UsersTable data={users} showDeviceIp={showDeviceIp} />
    </div>
  );
};

export default RegisterUsers;
