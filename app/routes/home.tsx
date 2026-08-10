import type { Route } from "./+types/home";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Portal de Clientes | Estudio Weremko" },
    {
      name: "description",
      content:
        "Portal privado de clientes de Estudio Weremko para seguimiento de trámites y gestión de documentación.",
    },
  ];
}
const supabaseUrl = "https://aioxkxhfxlilynygripl.supabase.co";
const supabaseAnonKey = "sb_publishable_Fg6trPrZcm_EB5dmYpyJTQ_zPGzB71T";

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default function Home() {
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
  return (
    <>
      <style>{`
        :root {
          --navy: #0d1b2f;
          --navy-soft: #172a46;
          --gold: #b99a63;
          --gold-light: #dbc89f;
          --text: #172033;
          --muted: #667085;
          --line: #e4e7ec;
          --light: #f5f7fa;
          --white: #ffffff;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          min-height: 100%;
        }

        body {
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Helvetica,
            Arial,
            sans-serif;
          background: var(--light);
          color: var(--text);
          -webkit-font-smoothing: antialiased;
        }

        .page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
        }

        .presentation {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100vh;
          padding: 55px 7%;
          color: white;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(185, 154, 99, 0.18),
              transparent 28%
            ),
            linear-gradient(135deg, #091625 0%, #122641 55%, #1c3555 100%);
        }

        .presentation::after {
          content: "";
          position: absolute;
          width: 540px;
          height: 540px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.07);
          right: -290px;
          bottom: -200px;
        }

        .brand {
          position: relative;
          z-index: 2;
        }

        .brand-main {
          display: block;
          font-size: 21px;
          font-weight: 800;
          letter-spacing: 2.1px;
        }

        .brand-sub {
          display: block;
          margin-top: 7px;
          color: #aab6c6;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2.4px;
        }

        .intro {
          position: relative;
          z-index: 2;
          max-width: 650px;
        }

        .eyebrow {
          color: var(--gold-light);
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-bottom: 20px;
        }

        .intro h1 {
          font-size: clamp(45px, 6vw, 74px);
          line-height: 1.02;
          letter-spacing: -2.5px;
          margin-bottom: 25px;
        }

        .intro h1 span {
          color: var(--gold-light);
        }

        .intro p {
          max-width: 570px;
          color: #c2ccd9;
          font-size: 16px;
          line-height: 1.8;
        }

        .features {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .feature {
          padding-top: 18px;
          border-top: 1px solid rgba(185,154,99,.35);
        }

        .feature strong {
          display: block;
          color: white;
          margin-bottom: 4px;
          font-size: 13px;
        }

        .feature span {
          color: #9eabbb;
          font-size: 11px;
          line-height: 1.5;
        }

        .access {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 55px 7%;
          background: white;
        }

        .access-box {
          width: 100%;
          max-width: 470px;
        }

        .access-label {
          display: inline-block;
          color: var(--gold);
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2.3px;
          margin-bottom: 14px;
        }

        .access h2 {
          color: var(--navy);
          font-size: clamp(32px, 4vw, 43px);
          letter-spacing: -1.5px;
          line-height: 1.1;
          margin-bottom: 15px;
        }

        .access-description {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.75;
          margin-bottom: 34px;
        }

        .field {
          margin-bottom: 19px;
        }

        .field label {
          display: block;
          color: #344054;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .field input {
          width: 100%;
          height: 52px;
          padding: 0 15px;
          color: var(--text);
          background: white;
          border: 1px solid #d0d5dd;
          border-radius: 7px;
          outline: none;
          font-size: 14px;
          transition:
            border-color .2s ease,
            box-shadow .2s ease;
        }

        .field input:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(185,154,99,.13);
        }

        .password-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .recovery {
          color: var(--navy-soft);
          font-size: 11px;
          font-weight: 650;
          text-decoration: none;
        }

        .submit {
          width: 100%;
          height: 52px;
          margin-top: 5px;
          border: 0;
          border-radius: 7px;
          background: var(--navy);
          color: white;
          cursor: pointer;
          font-size: 13px;
          font-weight: 750;
          letter-spacing: .2px;
          transition:
            transform .2s ease,
            background .2s ease;
        }

        .submit:hover {
          transform: translateY(-1px);
          background: #172d4b;
        }

        .status {
          margin-top: 15px;
          padding: 12px 14px;
          border-radius: 6px;
          background: #f8f6f1;
          border: 1px solid #ebe2d0;
          color: #766342;
          font-size: 11px;
          line-height: 1.6;
        }

        .security {
          margin-top: 27px;
          padding-top: 22px;
          border-top: 1px solid var(--line);
          display: flex;
          gap: 11px;
          align-items: flex-start;
        }

        .security-icon {
          width: 31px;
          height: 31px;
          flex: 0 0 31px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4f1ea;
          color: var(--gold);
          border-radius: 50%;
          font-size: 14px;
        }

        .security strong {
          display: block;
          color: #344054;
          font-size: 11px;
          margin-bottom: 3px;
        }

        .security p {
          color: #98a2b3;
          font-size: 10px;
          line-height: 1.5;
        }

        .back {
          display: inline-block;
          margin-top: 28px;
          color: #667085;
          text-decoration: none;
          font-size: 11px;
          font-weight: 650;
        }

        .back:hover {
          color: var(--navy);
        }

        @media (max-width: 900px) {
          .page {
            grid-template-columns: 1fr;
          }

          .presentation {
            min-height: auto;
            padding: 45px 7% 60px;
            gap: 75px;
          }

          .access {
            min-height: auto;
            padding: 70px 7%;
          }
        }

        @media (max-width: 600px) {
          .features {
            grid-template-columns: 1fr;
          }

          .presentation {
            gap: 55px;
          }

          .intro h1 {
            letter-spacing: -1.5px;
          }
        }
      `}</style>

      <main className="page">
        <section className="presentation">
          <div className="brand">
            <span className="brand-main">ESTUDIO WEREMKO</span>
            <span className="brand-sub">
              SERVICIOS JURÍDICOS · SEGUROS
            </span>
          </div>

          <div className="intro">
            <div className="eyebrow">Portal privado de clientes</div>

            <h1>
              Tus gestiones,
              <br />
              <span>en un solo lugar.</span>
            </h1>

            <p>
              Un espacio privado desarrollado para facilitar el intercambio de
              documentación, el seguimiento de trámites y la comunicación con
              Estudio Weremko.
            </p>
          </div>

          <div className="features">
            <div className="feature">
              <strong>Trámites</strong>
              <span>Consulta el estado y las novedades de tus gestiones.</span>
            </div>

            <div className="feature">
              <strong>Documentación</strong>
              <span>Envía archivos y documentación directamente al estudio.</span>
            </div>

            <div className="feature">
              <strong>Seguimiento</strong>
              <span>Accede a información actualizada de manera privada.</span>
            </div>
          </div>
        </section>

        <section className="access">
          <div className="access-box">
            <span className="access-label">Acceso clientes</span>

            <h2>Ingresar al portal</h2>

            <p className="access-description">
              Utilizá las credenciales proporcionadas por Estudio Weremko para
              acceder a tu espacio privado.
            </p>

            <form
            onSubmit={async (event) => {
  event.preventDefault();

  alert("El formulario está ejecutando JavaScript");

  setError("");
  setLoading(true);

  const form = event.currentTarget;
  const formData = new FormData(form);

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

let data;
let loginError;

try {
  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  data = result.data;
  loginError = result.error;

  alert(
    loginError
      ? `Supabase respondió con error: ${loginError.message}`
      : "Supabase respondió correctamente"
  );
} catch (err) {
  alert(
    `Error al conectar con Supabase: ${
      err instanceof Error ? err.message : String(err)
    }`
  );

  setLoading(false);
  return;
}

  if (loginError || !data.user) {
    setError("Correo electrónico o contraseña incorrectos.");
    setLoading(false);
    return;
  }

 const { data: perfil, error: perfilError } = await supabase
  .from("perfiles")
  .select("rol, activo, cliente_id")
  .eq("id", data.user.id)
  .single();

alert(
  perfilError
    ? `Error al consultar perfil: ${perfilError.message}`
    : `Perfil encontrado. Rol: ${perfil?.rol} - Activo: ${perfil?.activo}`
);

  if (perfilError || !perfil) {
    await supabase.auth.signOut();
    setError("No se encontró un perfil autorizado para este usuario.");
    setLoading(false);
    return;
  }

  if (perfil.activo === false) {
    await supabase.auth.signOut();
    setError("Este usuario se encuentra deshabilitado.");
    setLoading(false);
    return;
  }

  if (perfil.rol === "administrador") {
  alert("Redirigiendo al panel administrador");
  window.location.assign("/admin");
  return;

  if (perfil.rol === "cliente") {
    window.location.href = "/panel";
    return;
  }

  await supabase.auth.signOut();
  setError("El usuario no tiene un rol válido.");
  setLoading(false);
}}
            >
              <div className="field">
                <label htmlFor="email">Correo electrónico</label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@correo.com"
                  required
                />
              </div>

              <div className="field">
                <div className="password-row">
                  <label htmlFor="password">Contraseña</label>

                  <a className="recovery" href="#recuperar">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                />
              </div>

             <button className="submit" type="submit" disabled={loading}>
  {loading ? "Ingresando..." : "Ingresar al portal"}
</button>
              {error && (
  <div
    style={{
      marginTop: "12px",
      color: "#b42318",
      fontSize: "12px",
      lineHeight: "1.5",
    }}
  >
    {error}
  </div>
)}

              <div className="status">
                El sistema de autenticación se encuentra en etapa de
                configuración. Las credenciales serán habilitadas por Estudio
                Weremko.
              </div>
            </form>

            <div className="security">
              <div className="security-icon">✓</div>

              <div>
                <strong>Acceso privado</strong>
                <p>
                  La información del portal estará disponible únicamente para
                  usuarios autorizados por el estudio.
                </p>
              </div>
            </div>

            <a className="back" href="https://estudioweremko.com.ar">
              ← Volver a Estudio Weremko
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
