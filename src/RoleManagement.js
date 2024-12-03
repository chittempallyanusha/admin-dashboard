import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RoleManagement() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/roles').then(response => {
      setRoles(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Role Management</h1>
      <ul>
        {roles.map(role => (
          <li key={role.id}>
            {role.name} - Permissions: {role.permissions}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoleManagement;
