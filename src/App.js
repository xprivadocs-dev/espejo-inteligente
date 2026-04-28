import React, { useEffect, useRef, useState } from "react";

export default function App() {
  const videoRef = useRef();
  const [estado, setEstado] = useState("Listo");
  const [mensaje, setMensaje] = useState("Cámara activa");

  useEffect(() => {
    iniciar();
  }, []);

  const iniciar = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>🪞 Espejo Inteligente</h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="300"
        style={{ borderRadius: "10px" }}
      />

      <h2>Estado: {estado}</h2>
      <p>{mensaje}</p>
    </div>
  );
}
