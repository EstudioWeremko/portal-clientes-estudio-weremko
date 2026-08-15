import { useEffect, useState } from "react";
import { supabase } from "../supabase";

type Cliente = {
  id: string;
  nombre: string;
  apellido: string;
  dni: string | null;
  email: string | null;
  telefono: string | null;
  localidad: string | null;
  domicilio: string | null;
  observaciones: string | null;
  activo: boolean;
  creado_en: string;
};

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    verificarAcceso();
  }, []);

  async function verificarAcceso() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      window.location.href = "/";
      return;
    }

    const { data: perfil, error } = await supabase
      .from("perfiles")
      .select("rol, activo")
      .eq("id", session.user.id)
      .single();

    if (
      error ||
      !perfil ||
      String(perfil.rol ?? "").trim().toLowerCase() !== "administrador" ||
      perfil.activo === false
    ) {
      window.location.href = "/";
      return;
    }

    await cargarClientes();
  }

  async function cargarClientes() {
    setLoading(true);

    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("apellido", { ascending: true })
      .order("nombre", { ascending: true });

    if (error) {
      setMensaje("Error al cargar clientes: " + error.message);
      setLoading(false);
      return;
    }

    setClientes(data || []);
    setLoading(false);
  }

  async function crearCliente(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!nombre.trim() || !apellido.trim()) {
      setMensaje("Nombre y apellido son obligatorios.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    const { error } = await supabase.from("clientes").insert({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      dni: dni.trim() || null,
      email: email.trim() || null,
      telefono: telefono.trim() || null,
      localidad: localidad.trim() || null,
      domicilio: domicilio.trim() || null,
      observaciones: observaciones.trim() || null,
      activo: true,
    });

    if (error) {
      setMensaje("No se pudo crear el cliente: " + error.message);
      setGuardando(false);
      return;
    }

    setNombre("");
    setApellido("");
    setDni("");
    setEmail("");
    setTelefono("");
    setLocalidad("");
    setDomicilio("");
    setObservaciones("");

    setMensaje("Cliente creado correctamente.");
    setGuardando(false);

    await cargarClientes();
  }

  async function cambiarEstado(cliente: Cliente) {
    const { error } = await supabase
      .from("clientes")
      .update({
        activo: !cliente.activo,
        actualizado_en: new Date().toISOString(),
      })
      .eq("id", cliente.id);

    if (error) {
      setMensaje("No se pudo modificar el cliente: " + error.message);
      return;
    }

    setMensaje(
      cliente.activo
        ? "Cliente desactivado correctamente."
        : "Cliente activado correctamente."
    );

    await cargarClientes();
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const texto =
      `${cliente.nombre} ${cliente.apellido} ${cliente.dni || ""} ${
        cliente.email || ""
      } ${cliente.telefono || ""}`.toLowerCase();

    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f8" }}>
      <header
        style={{
          background: "#111d29",
          color: "white",
          padding: "24px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "24px" }}>ESTUDIO WEREMKO</h1>
          <p style={{ margin: "6px 0 0" }}>Administración de Clientes</p>
        </div>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <a href="/admin" style={{ color: "white" }}>
            Volver al panel
          </a>

          <button
            onClick={cerrarSesion}
            style={{
              background: "transparent",
              color: "white",
              border: "1px solid white",
              padding: "10px 16px",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        <h2>Clientes</h2>

        <p style={{ color: "#596675" }}>
          Alta y administración de clientes de Estudio Weremko.
        </p>

        {mensaje && (
          <div
            style={{
              margin: "20px 0",
              padding: "14px",
              background: "#ffffff",
              border: "1px solid #d9dee5",
              borderRadius: "8px",
            }}
          >
            {mensaje}
          </div>
        )}

        <section
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            marginTop: "28px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Nuevo cliente</h3>

          <form onSubmit={crearCliente}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <input
                placeholder="Nombre *"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

              <input
                placeholder="Apellido *"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />

              <input
                placeholder="DNI / CUIT"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />

              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />

              <input
                placeholder="Localidad"
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
              />

              <input
                placeholder="Domicilio"
                value={domicilio}
                onChange={(e) => setDomicilio(e.target.value)}
              />
            </div>

            <textarea
              placeholder="Observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              style={{
                width: "100%",
                marginTop: "16px",
                minHeight: "90px",
                boxSizing: "border-box",
              }}
            />

            <button
              type="submit"
              disabled={guardando}
              style={{
                marginTop: "18px",
                background: "#18395f",
                color: "white",
                border: "none",
                padding: "13px 24px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {guardando ? "Guardando..." : "Crear cliente"}
            </button>
          </form>
        </section>

        <section
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            marginTop: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <h3 style={{ margin: 0 }}>Clientes registrados</h3>

            <input
              placeholder="Buscar cliente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ padding: "10px", minWidth: "260px" }}
            />
          </div>

          {loading ? (
            <p>Cargando clientes...</p>
          ) : clientesFiltrados.length === 0 ? (
            <p style={{ marginTop: "24px" }}>No hay clientes registrados.</p>
          ) : (
            <div style={{ overflowX: "auto", marginTop: "20px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th align="left">Cliente</th>
                    <th align="left">DNI/CUIT</th>
                    <th align="left">Email</th>
                    <th align="left">Teléfono</th>
                    <th align="left">Localidad</th>
                    <th align="left">Estado</th>
                    <th align="left">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {clientesFiltrados.map((cliente) => (
                    <tr key={cliente.id}>
                      <td style={{ padding: "14px 6px" }}>
                        {cliente.apellido}, {cliente.nombre}
                      </td>

                      <td>{cliente.dni || "-"}</td>
                      <td>{cliente.email || "-"}</td>
                      <td>{cliente.telefono || "-"}</td>
                      <td>{cliente.localidad || "-"}</td>

                      <td>{cliente.activo ? "Activo" : "Inactivo"}</td>

                      <td>
                        <button
                          onClick={() => cambiarEstado(cliente)}
                          style={{
                            padding: "7px 10px",
                            cursor: "pointer",
                          }}
                        >
                          {cliente.activo ? "Desactivar" : "Activar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
