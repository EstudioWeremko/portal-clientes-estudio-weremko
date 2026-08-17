import { useEffect, useState } from "react";
import { supabase } from "../supabase";

type Cliente = {
  id: string;
  nombre: string;
  apellido: string;
  activo: boolean;
};

type Tramite = {
  id: string;
  cliente_id: string;
  numero: string | null;
  titulo: string;
  tipo: string | null;
  descripcion: string | null;
  estado: string;
  fecha_inicio: string;
  fecha_finalizacion: string | null;
  observaciones: string | null;
  activo: boolean;
  creado_en: string;
  clientes?: {
    nombre: string;
    apellido: string;
  } | null;
};

export default function Tramites() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const [clienteId, setClienteId] = useState("");
  const [numero, setNumero] = useState("");
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("En gestión");
  const [fechaInicio, setFechaInicio] = useState(
    new Date().toISOString().slice(0, 10)
  );
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

    await cargarDatos();
  }

  async function cargarDatos() {
    setLoading(true);

    const { data: clientesData, error: clientesError } = await supabase
      .from("clientes")
      .select("id, nombre, apellido, activo")
      .eq("activo", true)
      .order("apellido", { ascending: true })
      .order("nombre", { ascending: true });

    if (clientesError) {
      setMensaje("Error al cargar clientes: " + clientesError.message);
      setLoading(false);
      return;
    }

    const { data: tramitesData, error: tramitesError } = await supabase
      .from("tramites")
      .select(`
        *,
        clientes (
          nombre,
          apellido
        )
      `)
      .order("creado_en", { ascending: false });

    if (tramitesError) {
      setMensaje("Error al cargar trámites: " + tramitesError.message);
      setLoading(false);
      return;
    }

    setClientes(clientesData || []);
    setTramites(tramitesData || []);
    setLoading(false);
  }

  async function crearTramite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!clienteId) {
      setMensaje("Debe seleccionar un cliente.");
      return;
    }

    if (!titulo.trim()) {
      setMensaje("El título del trámite es obligatorio.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    const { error } = await supabase.from("tramites").insert({
      cliente_id: clienteId,
      numero: numero.trim() || null,
      titulo: titulo.trim(),
      tipo: tipo.trim() || null,
      descripcion: descripcion.trim() || null,
      estado,
      fecha_inicio: fechaInicio,
      observaciones: observaciones.trim() || null,
      activo: true,
    });

    if (error) {
      setMensaje("No se pudo crear el trámite: " + error.message);
      setGuardando(false);
      return;
    }

    setClienteId("");
    setNumero("");
    setTitulo("");
    setTipo("");
    setDescripcion("");
    setEstado("En gestión");
    setFechaInicio(new Date().toISOString().slice(0, 10));
    setObservaciones("");

    setMensaje("Trámite creado correctamente.");
    setGuardando(false);

    await cargarDatos();
  }

  async function cambiarEstadoActivo(tramite: Tramite) {
    const { error } = await supabase
      .from("tramites")
      .update({
        activo: !tramite.activo,
        actualizado_en: new Date().toISOString(),
      })
      .eq("id", tramite.id);

    if (error) {
      setMensaje("No se pudo modificar el trámite: " + error.message);
      return;
    }

    setMensaje(
      tramite.activo
        ? "Trámite desactivado correctamente."
        : "Trámite activado correctamente."
    );

    await cargarDatos();
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const tramitesFiltrados = tramites.filter((tramite) => {
    const cliente = tramite.clientes
      ? `${tramite.clientes.apellido} ${tramite.clientes.nombre}`
      : "";

    const texto = `${cliente} ${tramite.numero || ""} ${tramite.titulo} ${
      tramite.tipo || ""
    } ${tramite.estado}`.toLowerCase();

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
          <p style={{ margin: "6px 0 0" }}>Administración de Trámites</p>
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
        <h2>Trámites</h2>

        <p style={{ color: "#596675" }}>
          Alta y seguimiento de trámites vinculados a clientes.
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
          <h3 style={{ marginTop: 0 }}>Nuevo trámite</h3>

          <form onSubmit={crearTramite}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                required
              >
                <option value="">Seleccionar cliente *</option>

                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.apellido}, {cliente.nombre}
                  </option>
                ))}
              </select>

              <input
                placeholder="Número interno"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />

              <input
                placeholder="Título del trámite *"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />

              <input
                placeholder="Tipo de trámite"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              />

              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="En gestión">En gestión</option>
                <option value="Pendiente de documentación">
                  Pendiente de documentación
                </option>
                <option value="En análisis">En análisis</option>
                <option value="Presentado">Presentado</option>
                <option value="En negociación">En negociación</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Archivado">Archivado</option>
              </select>

              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>

            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={{
                width: "100%",
                marginTop: "16px",
                minHeight: "90px",
                boxSizing: "border-box",
              }}
            />

            <textarea
              placeholder="Observaciones internas"
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
              {guardando ? "Guardando..." : "Crear trámite"}
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
            <h3 style={{ margin: 0 }}>Trámites registrados</h3>

            <input
              placeholder="Buscar trámite..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ padding: "10px", minWidth: "260px" }}
            />
          </div>

          {loading ? (
            <p>Cargando trámites...</p>
          ) : tramitesFiltrados.length === 0 ? (
            <p style={{ marginTop: "24px" }}>No hay trámites registrados.</p>
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
                    <th align="left">Número</th>
                    <th align="left">Trámite</th>
                    <th align="left">Tipo</th>
                    <th align="left">Estado</th>
                    <th align="left">Inicio</th>
                    <th align="left">Activo</th>
                    <th align="left">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {tramitesFiltrados.map((tramite) => (
                    <tr key={tramite.id}>
                      <td style={{ padding: "14px 6px" }}>
                        {tramite.clientes
                          ? `${tramite.clientes.apellido}, ${tramite.clientes.nombre}`
                          : "-"}
                      </td>

                      <td>{tramite.numero || "-"}</td>
                      <td>{tramite.titulo}</td>
                      <td>{tramite.tipo || "-"}</td>
                      <td>{tramite.estado}</td>
                      <td>{tramite.fecha_inicio}</td>
                      <td>{tramite.activo ? "Sí" : "No"}</td>

                      <td>
                        <button
                          onClick={() => cambiarEstadoActivo(tramite)}
                          style={{
                            padding: "7px 10px",
                            cursor: "pointer",
                          }}
                        >
                          {tramite.activo ? "Desactivar" : "Activar"}
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
