import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../supabase";

type TramiteDetalle = {
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
  clientes?: {
    nombre: string;
    apellido: string;
  } | null;
};

type Movimiento = {
  id: string;
  tramite_id: string;
  titulo: string;
  detalle: string | null;
  visible_cliente: boolean;
  fecha_movimiento: string;
  creado_en: string;
};

export default function TramiteDetalle() {
  const { id } = useParams();

  const [tramite, setTramite] = useState<TramiteDetalle | null>(null);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [tituloMovimiento, setTituloMovimiento] = useState("");
  const [detalleMovimiento, setDetalleMovimiento] = useState("");
  const [fechaMovimiento, setFechaMovimiento] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [visibleCliente, setVisibleCliente] = useState(true);

  useEffect(() => {
    verificarAcceso();
  }, [id]);

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

    await cargarDetalle();
  }

  async function cargarDetalle() {
    if (!id) {
      setMensaje("No se encontró el identificador del trámite.");
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data: tramiteData, error: tramiteError } = await supabase
      .from("tramites")
      .select(`
        id,
        cliente_id,
        numero,
        titulo,
        tipo,
        descripcion,
        estado,
        fecha_inicio,
        fecha_finalizacion,
        observaciones,
        activo,
        clientes (
          nombre,
          apellido
        )
      `)
      .eq("id", id)
      .single();

    if (tramiteError) {
      setMensaje("No se pudo cargar el trámite: " + tramiteError.message);
      setLoading(false);
      return;
    }

    const { data: movimientosData, error: movimientosError } = await supabase
      .from("movimientos_tramite")
      .select("*")
      .eq("tramite_id", id)
      .order("fecha_movimiento", { ascending: false });

    if (movimientosError) {
      setMensaje(
        "No se pudo cargar el historial: " + movimientosError.message
      );
      setLoading(false);
      return;
    }

    setTramite(tramiteData);
    setMovimientos(movimientosData || []);
    setLoading(false);
  }

  async function crearMovimiento(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!id) return;

    if (!tituloMovimiento.trim()) {
      setMensaje("El título del movimiento es obligatorio.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { error } = await supabase.from("movimientos_tramite").insert({
      tramite_id: id,
      titulo: tituloMovimiento.trim(),
      detalle: detalleMovimiento.trim() || null,
      visible_cliente: visibleCliente,
      fecha_movimiento: new Date(fechaMovimiento).toISOString(),
      creado_por: session?.user?.id || null,
    });

    if (error) {
      setMensaje("No se pudo crear el movimiento: " + error.message);
      setGuardando(false);
      return;
    }

    setTituloMovimiento("");
    setDetalleMovimiento("");
    setFechaMovimiento(new Date().toISOString().slice(0, 16));
    setVisibleCliente(true);

    setMensaje("Movimiento agregado correctamente.");
    setGuardando(false);

    await cargarDetalle();
  }

  async function eliminarMovimiento(movimiento: Movimiento) {
    const confirmar = window.confirm(
      "¿Desea eliminar este movimiento del historial?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("movimientos_tramite")
      .delete()
      .eq("id", movimiento.id);

    if (error) {
      setMensaje("No se pudo eliminar el movimiento: " + error.message);
      return;
    }

    setMensaje("Movimiento eliminado correctamente.");
    await cargarDetalle();
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return <div style={{ padding: "40px" }}>Cargando trámite...</div>;
  }

  if (!tramite) {
    return (
      <div style={{ padding: "40px" }}>
        <p>{mensaje || "No se encontró el trámite."}</p>
        <a href="/tramites">Volver a trámites</a>
      </div>
    );
  }

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
          <p style={{ margin: "6px 0 0" }}>Ficha del Trámite</p>
        </div>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <a href="/tramites" style={{ color: "white" }}>
            Volver a trámites
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
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        {mensaje && (
          <div
            style={{
              marginBottom: "20px",
              padding: "14px",
              background: "white",
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
          }}
        >
          <h2 style={{ marginTop: 0 }}>{tramite.titulo}</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            <div>
              <strong>Cliente</strong>
              <div>
                {tramite.clientes
                  ? `${tramite.clientes.apellido}, ${tramite.clientes.nombre}`
                  : "-"}
              </div>
            </div>

            <div>
              <strong>Número</strong>
              <div>{tramite.numero || "-"}</div>
            </div>

            <div>
              <strong>Tipo</strong>
              <div>{tramite.tipo || "-"}</div>
            </div>

            <div>
              <strong>Estado</strong>
              <div>{tramite.estado}</div>
            </div>

            <div>
              <strong>Fecha de inicio</strong>
              <div>{tramite.fecha_inicio}</div>
            </div>

            <div>
              <strong>Fecha de finalización</strong>
              <div>{tramite.fecha_finalizacion || "-"}</div>
            </div>
          </div>

          {tramite.descripcion && (
            <div style={{ marginTop: "24px" }}>
              <strong>Descripción</strong>
              <p>{tramite.descripcion}</p>
            </div>
          )}

          {tramite.observaciones && (
            <div style={{ marginTop: "20px" }}>
              <strong>Observaciones internas</strong>
              <p>{tramite.observaciones}</p>
            </div>
          )}
        </section>

        <section
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            marginTop: "28px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Agregar movimiento</h3>

          <form onSubmit={crearMovimiento}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "16px",
              }}
            >
              <input
                placeholder="Título del movimiento *"
                value={tituloMovimiento}
                onChange={(e) => setTituloMovimiento(e.target.value)}
                required
              />

              <input
                type="datetime-local"
                value={fechaMovimiento}
                onChange={(e) => setFechaMovimiento(e.target.value)}
              />
            </div>

            <textarea
              placeholder="Detalle"
              value={detalleMovimiento}
              onChange={(e) => setDetalleMovimiento(e.target.value)}
              style={{
                width: "100%",
                minHeight: "100px",
                marginTop: "16px",
                boxSizing: "border-box",
              }}
            />

            <label
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                marginTop: "16px",
              }}
            >
              <input
                type="checkbox"
                checked={visibleCliente}
                onChange={(e) => setVisibleCliente(e.target.checked)}
              />
              Visible para el cliente
            </label>

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
              {guardando ? "Guardando..." : "Agregar movimiento"}
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
          <h3 style={{ marginTop: 0 }}>Historial del trámite</h3>

          {movimientos.length === 0 ? (
            <p>No hay movimientos registrados.</p>
          ) : (
            <div>
              {movimientos.map((movimiento) => (
                <div
                  key={movimiento.id}
                  style={{
                    borderLeft: "3px solid #18395f",
                    padding: "4px 0 18px 18px",
                    marginBottom: "18px",
                  }}
                >
                  <strong>{movimiento.titulo}</strong>

                  <div
                    style={{
                      color: "#667085",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}
                  >
                    {new Date(movimiento.fecha_movimiento).toLocaleString(
                      "es-AR"
                    )}
                  </div>

                  {movimiento.detalle && (
                    <p style={{ marginBottom: "8px" }}>
                      {movimiento.detalle}
                    </p>
                  )}

                  <div style={{ fontSize: "14px" }}>
                    {movimiento.visible_cliente
                      ? "Visible para el cliente"
                      : "Movimiento interno"}
                  </div>

                  <button
                    type="button"
                    onClick={() => eliminarMovimiento(movimiento)}
                    style={{
                      marginTop: "10px",
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
