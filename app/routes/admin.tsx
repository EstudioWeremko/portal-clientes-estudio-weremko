import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("Administrador");

   useEffect(() => {
  async function verificarAcceso() {
    alert("ADMIN 1 - Iniciando verificación");

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    alert(
      sessionError
        ? `ADMIN 2 - Error sesión: ${sessionError.message}`
        : session
          ? `ADMIN 2 - Sesión encontrada: ${session.user.email}`
          : "ADMIN 2 - No hay sesión"
    );

    if (sessionError || !session?.user) {
      window.location.href = "/";
      return;
    }

    const user = session.user;

    alert("ADMIN 3 - Voy a consultar el perfil");

    const { data: perfil, error } = await supabase
      .from("perfiles")
      .select("nombre, apellido, rol, activo")
      .eq("id", user.id)
      .single();

    alert(
      error
        ? `ADMIN 4 - Error perfil: ${error.message}`
        : `ADMIN 4 - Perfil encontrado: ${perfil?.rol} - activo: ${perfil?.activo}`
    );

    if (
      error ||
      !perfil ||
      String(perfil.rol ?? "").trim().toLowerCase() !== "administrador" ||
      perfil.activo === false
    ) {
      await supabase.auth.signOut();
      window.location.href = "/";
      return;
    }

    const nombreCompleto =
      `${perfil.nombre || ""} ${perfil.apellido || ""}`.trim();

    setNombre(nombreCompleto || "Administrador");
    setLoading(false);
  }

  verificarAcceso();
}, []);
  async function cerrarSesion() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return <div style={{ padding: "40px" }}>Verificando acceso...</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6f8",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          background: "#17202a",
          color: "white",
          padding: "22px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <strong style={{ fontSize: "22px" }}>ESTUDIO WEREMKO</strong>
          <div style={{ marginTop: "4px", fontSize: "13px" }}>
            Panel de Administración
          </div>
        </div>

        <button onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </header>

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "35px",
        }}
      >
        <h1>Panel de Administración</h1>

        <p>Bienvenido, {nombre}.</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
        <Tarjeta
  titulo="Clientes"
  descripcion="Administrar clientes del estudio."
  enlace="/clientes"
/>

         <Tarjeta
  titulo="Trámites"
  descripcion="Crear y gestionar trámites."
  enlace="/tramites"
/>

          <Tarjeta
            titulo="Documentación"
            descripcion="Gestionar documentación y archivos."
          />

          <Tarjeta
            titulo="Novedades"
            descripcion="Publicar novedades para los clientes."
          />

          <Tarjeta
            titulo="Tareas internas"
            descripcion="Gestionar tareas del estudio."
          />

          <Tarjeta
            titulo="Notas internas"
            descripcion="Registrar notas privadas de los trámites."
          />
        </div>
      </main>
    </div>
  );
}

function Tarjeta({
  titulo,
  descripcion,
  enlace,
}: {
  titulo: string;
  descripcion: string;
  enlace?: string;
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>{titulo}</h2>

      <p style={{ color: "#667085" }}>{descripcion}</p>

   {enlace ? (
  <a href={enlace}>Administrar</a>
) : (
  <button type="button">Administrar</button>
)}
    </div>
  );
}
