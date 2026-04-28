import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function App() {
  const videoRef = useRef();
  const [estado, setEstado] = useState("Cargando...");
  const [mensaje, setMensaje] = useState("Iniciando IA...");

  useEffect(() => {
    iniciar();
  }, []);

  const iniciar = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;

    detectar();
  };

  const detectar = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0) {
        const expresiones = detections[0].expressions;
        const estadoDetectado = obtenerEstado(expresiones);
        setEstado(estadoDetectado);
        generarConsejoIA(estadoDetectado);
      }
    }, 3000);
  };

  const obtenerEstado = (expresiones) => {
    const max = Object.keys(expresiones).reduce((a, b) =>
      expresiones[a] > expresiones[b] ? a : b
    );

    switch (max) {
      case "happy": return "feliz";
      case "sad": return "cansado";
      case "angry": return "estresado";
      case "surprised": return "motivado";
      default: return "neutral";
    }
  };

  const generarConsejoIA = async (estado) => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer TU_API_KEY_AQUI"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Eres un asistente motivador que da consejos cortos."
            },
            {
              role: "user",
              content: `Me siento ${estado}, dame un consejo.`
            }
          ]
        })
      });

      const data = await response.json();
      setMensaje(data.choices?.[0]?.message?.content || "Sin respuesta");

    } catch (error) {
      setMensaje("Error con IA 😢");
    }
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
