import { useState, useEffect } from "react";
import { Loader } from "../../../components/Loader";
import { showErrorToast } from "../../../kernel/alerts";
import { profileController } from "../adapters/profile.controller";
import EstatusBadge from "./EstatusBadge";
import "./personal-profile.css";

const PersonalProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPersonalProfile();
  }, []);

  const loadPersonalProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileController.getPersonalProfile();
      
      if (response.result) {
        setUser(response.result);
      } else {
        setError("No se pudo cargar el perfil");
        showErrorToast({
          title: "Error",
          text: "No se pudo obtener la información del perfil"
        });
      }
    } catch (err) {
      console.error("Error al cargar perfil personal:", err);
      setError(err.message || "Error al cargar el perfil");
      showErrorToast({
        title: "Error",
        text: "No se pudo cargar la información del perfil"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !user) {
    return (
      <div className="personal-profile-error">
        <div className="error-container">
          <h2>Error al cargar el perfil</h2>
          <p>{error || "No se encontró información del perfil"}</p>
          <button onClick={loadPersonalProfile} className="btn-retry">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="personal-profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-initials">
            {user.name?.[0]?.toUpperCase()}{user.lastname?.[0]?.toUpperCase()}
          </span>
        </div>
        <div className="profile-info">
          <h1>
            {user.name} {user.lastname}
          </h1>
          <p className="profile-email">{user.email}</p>
          <EstatusBadge estatus={user.status} />
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-section">
          <h3>Información Personal</h3>
          <div className="detail-row">
            <label>Nombre:</label>
            <span>{user.name}</span>
          </div>
          <div className="detail-row">
            <label>Apellido:</label>
            <span>{user.lastname}</span>
          </div>
          <div className="detail-row">
            <label>Correo:</label>
            <span>{user.email}</span>
          </div>
          <div className="detail-row">
            <label>Teléfono:</label>
            <span>{user.phoneNumber || "No especificado"}</span>
          </div>
        </div>

        <div className="detail-section">
          <h3>Cuenta</h3>
          <div className="detail-row">
            <label>ID de Usuario:</label>
            <span>{user.userId}</span>
          </div>
          <div className="detail-row">
            <label>Estado:</label>
            <span>
              <EstatusBadge estatus={user.status} />
            </span>
          </div>
          <div className="detail-row">
            <label>Intentos Fallidos:</label>
            <span>{user.attempts || 0}</span>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button onClick={loadPersonalProfile} className="btn-refresh">
          Actualizar
        </button>
      </div>
    </div>
  );
};

export default PersonalProfile;
