import React, { useState, useEffect } from "react";
import { getUsersList, changeUserStatus } from "../adapters/user.controller";
import { showSuccessToast, showErrorToast } from "../../../kernel/toasts";
import { EditUserModal } from "./EditUserModal";
import "./users-list.css";

export const UsersListComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers(0, searchQuery);
  }, []);

  const loadUsers = async (page, search = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsersList(page, pageSize, search);

      if (response && response.type === "SUCCESS" && response.result) {
        const { content, totalPages, totalElements } = response.result;
        setUsers(content || []);
        setTotalPages(totalPages || 0);
        setTotalElements(totalElements || 0);
        setCurrentPage(page);
      } else {
        setError("No se pudo cargar la lista de usuarios");
        setUsers([]);
      }
    } catch (err) {
      setError("Error al cargar usuarios");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      loadUsers(0, searchQuery);
    } else {
      loadUsers(0, "");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    loadUsers(0, "");
  };

  const handleChangeStatus = async (userId, currentStatus) => {
    try {
      const response = await changeUserStatus(userId);

      if (response && response.type === "SUCCESS") {
        setUsers(
          users.map((user) =>
            user.userId === userId ? { ...user, status: !currentStatus } : user
          )
        );
        showSuccessToast(
          `Estado actualizado a ${!currentStatus ? "Activo" : "Inactivo"}`
        );
      } else {
        showErrorToast("Error al cambiar el estado del usuario");
      }
    } catch (err) {
      showErrorToast("Error al cambiar el estado");
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    loadUsers(currentPage, searchQuery);
  };

  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) {
      loadUsers(currentPage + 1, searchQuery);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      loadUsers(currentPage - 1, searchQuery);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="users-list-container">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="users-list-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="users-list-container">
      <h2>Gestión de Usuarios</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="search-input"
        />
        <button onClick={handleSearch} className="btn-search">
          Buscar
        </button>
        {searchQuery && (
          <button onClick={handleClearSearch} className="btn-clear">
            Limpiar
          </button>
        )}
      </div>

      {users.length === 0 ? (
        <p className="no-users">No hay usuarios disponibles</p>
      ) : (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId}>
                  <td>{user.name}</td>
                  <td>{user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.status ? "active" : "inactive"
                      }`}
                    >
                      {user.status ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="btn-edit"
                        title="Editar usuario"
                      >
                        ✎ Editar
                      </button>
                      <button
                        onClick={() =>
                          handleChangeStatus(user.userId, user.status)
                        }
                        className={`btn-toggle ${
                          user.status ? "btn-deactivate" : "btn-activate"
                        }`}
                        title={user.status ? "Desactivar" : "Activar"}
                      >
                        {user.status ? "⊘ Desactivar" : "✓ Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className="btn-pagination"
          >
            Anterior
          </button>
          <span className="page-info">
            Página {currentPage + 1} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage + 1 >= totalPages}
            className="btn-pagination"
          >
            Siguiente
          </button>
        </div>
      )}

      <div className="total-info">
        <p>Total: {totalElements} usuarios</p>
      </div>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};
