import React from "react";
import SkeletonLoader from "../../../../components/common/SkeletonLoader";
import Alert from "../../../../components/ui/alert/Alert";
import { User } from "../../../../interfaces/api/userInterface";
import { useGetItemsQuery } from "../../../../services/usersSupabase";
import UsersTable from "./UsersTable";

const Users: React.FC = () => {
  const { data: usersData = [], isLoading, error } = useGetItemsQuery("");
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const users: User[] = (usersData ?? []).map((user: any) => ({
    ...user,
    roles: Array.isArray(user.roles) ? user.roles[0] : user.roles,
    user_groups: Array.isArray(user.user_groups)
      ? user.user_groups[0]
      : user.user_groups,
  }));

  // Determinar si hay algún usuario que NO sea enfermero



  if (isLoading) return <SkeletonLoader />;
  if (error)
    return (
      <Alert
        variant="error"
        title="Connection error"
        message="Failed to connect to the server. Please check your network connection."
      />
    );

  return (
    <div>
      <UsersTable data={users}  />
    </div>
  );
};

export default Users;
