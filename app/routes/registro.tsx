import { useState } from "react";
import { supabase } from "../supabase";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function registrarCliente(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMensaje("");

    if (!nombre.trim() || !apellido.trim()) {
      setMensaje("Nombre y apellido son obligatorios.");
      return;
    }

    if (!email.trim()) {
      setMensaje("El correo electrónico es obligatorio.");
      return;
    }

    if (password.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmarPassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    setGuardando(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: "https://app.estudioweremko.com.ar",
        data: {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          dni: dni.trim() || null,
          telefono: telefono.trim() || null,
          rol: "cliente",
        },
      },
    });

    if (error) {
      setMensaje("No se pudo crear la cuenta: " + error.message);
      setGuardando(false);
      return;
    }

    if (!data.user) {
      setMensaje("No se pudo crear el usuario.");
      setGuardando(false);
      return;
    }

    setMensaje(
      "Cuenta creada correctamente. Revisá tu correo electrónico y confirmá tu cuenta para poder ingresar."
    );

    setNombre("");
    setApellido("");
    setDni("");
    setTelefono("");
    setEmail("");
    setPassword("");
    setConfirmarPassword("");

    setGuardando(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
      }}
    >
      <header
        style={{
          background: "#111d29",
          color: "white",
          padding: "28px 32px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "24px",
          }}
        >
          ESTUDIO WEREMKO
        </h1>

        <p
          style={{
            margin: "6px 0 0",
          }}
        >
          Portal Privado de Clientes
        </p>
      </header>

      <main
        style={{
          maxWidth: "650px",
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        <section
          style={{
            background: "white",
            padding: "32px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <p
            style={{
              color: "#a37b39",
              fontWeight: 700,
              letterSpacing: "1.5px",
              fontSize: "13px",
              marginTop: 0,
            }}
          >
            ACCESO CLIENTES
          </p>

          <h2
            style={{
              marginTop: 0,
              fontSize: "30px",
            }}
          >
            Crear cuenta
          </h2>

          <p
            style={{
              color: "#667085",
              lineHeight: 1.6,
            }}
          >
            Registrate para acceder a tu espacio privado, iniciar solicitudes,
            consultar tus trámites y cargar documentación.
          </p>

          {mensaje && (
            <div
              style={{
                margin: "20px 0",
                padding: "14px",
                border: "1px solid #d9dee5",
                borderRadius: "8px",
                background: "#f8fafc",
              }}
            >
              {mensaje}
            </div>
          )}

          <form onSubmit={registrarCliente}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <div>
                <label>Nombre *</label>
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px",
                    marginTop: "6px",
                  }}
                />
              </div>

              <div>
                <label>Apellido *</label>
                <input
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px",
                    marginTop: "6px",
                  }}
                />
              </div>

              <div>
                <label>DNI / CUIT</label>
                <input
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px",
                    marginTop: "6px",
                  }}
                />
              </div>

              <div>
                <label>Teléfono</label>
                <input
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px",
                    marginTop: "6px",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: "16px",
              }}
            >
              <label>Correo electrónico *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px",
                  marginTop: "6px",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              <div>
                <label>Contraseña *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px",
                    marginTop: "6px",
                  }}
                />
              </div>

              <div>
                <label>Confirmar contraseña *</label>
                <input
                  type="password"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px",
                    marginTop: "6px",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={guardando}
              style={{
                width: "100%",
                marginTop: "24px",
                background: "#18395f",
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius: "6px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {guardando ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
            }}
          >
            <a href="/">Ya tengo una cuenta — Ingresar</a>
          </div>
        </section>
      </main>
    </div>
  );
}
