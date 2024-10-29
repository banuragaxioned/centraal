import React from "react";

import { DataTable } from "./data-table";
import { columns } from "./columns";

type User = {
  id: number;
  name: string;
  image: string;
  hours: number;
  subRows: {
    name: string;
    hours: number;
    comments: string;
    task: { name: string } | null;
    milestone: { name: string } | null;
    billable: boolean;
    projectName: string;
  }[];
};

type Project = {
  name: string;
  client: { name: string };
};

type UserDetailsProps = {
  userData: User[];
  projectData: Project;
};

const UserDetails: React.FC<UserDetailsProps> = ({ userData, projectData }) => {
  return (
    <div className="mt-4">
      {/* <DataTable columns={columns} data={userData} /> */}
      <DataTable columns={columns} data={userData.map(user => {
        user.subRows = user.subRows.map(subRow => {
          return {
            ...subRow,
            projectName: projectData.name,
            clientName: projectData.client.name,
          };
        });
        return {
          ...user,
        };
      })} />
    </div>
  );
};

export default UserDetails;
