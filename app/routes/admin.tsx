import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aioxkxhfylilynygripl.supabase.co";
const supabaseAnonKey = "sb_publishable_Fg6trPrZcm_EB5dmYpyJTQ_zPGzB71T";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("Administrador");

  useEffect(() => {
    async function verificarAcceso() {
  const {
  data: { user },
  error: userError,
} = await supabase.auth.getUser();

alert(
  userError
    ? `ADMIN - Error obteniendo usuario: ${userError.message}`
    : user
      ? `ADMIN - Sesión encontrada: ${user.email}`
      : "ADMIN - NO HAY SESIÓN"
);

if (!user) {
  window.location.href = "/";
  return;
}

      const { data: perfil, error } = await supabase
        .from("perfiles")
        .select("nombre, apellido, rol, activo")
        .eq("id", user.id)
        .single();

      if (
        error ||
        !perfil ||
        String(perfil.rol ?? "").trim().toLowerCase() !== "administrador"
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
          />

          <Tarjeta
            titulo="Trámites"
            descripcion="Crear y gestionar trámites."
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
}: {
  titulo: string;
  descripcion: string;
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

      <button type="button">
        Administrar
      </button>
    </div>
  );
}
