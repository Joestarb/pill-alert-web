import React, {  useState } from "react";
import EditGroupModal from "./components/EditGroupModal";
import GroupsTable from "./components/GroupsTable";
import InsertGroupModal from "./components/InsertGroupModal";
import { useGetGroupsQuery } from "../../../services/GroupSupabase";

const Groups: React.FC = () => {
  const [isInsertModalOpen, setInsertModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{
    group_id: number;
    group_name: string;
  } | null>(null);

    const {  refetch } = useGetGroupsQuery({});

  const handleInsert = () => setInsertModalOpen(true);
  const handleEdit = (group: { group_id: number; group_name: string }) => {
    setSelectedGroup(group);
    setEditModalOpen(true);
  };

  return (
    <>
      <GroupsTable
        onEdit={handleEdit}
        onInsert={handleInsert}
        refetchGroups={refetch}
      />
      <InsertGroupModal
        isOpen={isInsertModalOpen}
        onClose={() => setInsertModalOpen(false)}
        refetchGroups={refetch}
      />
      <EditGroupModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        group={selectedGroup}
        refetchGroups={refetch}
      />
    </>
  );
};

export default Groups;
