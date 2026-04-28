import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function App() {
  const videoRef = useRef();
  const [estado, setEstado] = useState("Cargando...");

  useEffect(() => {
    iniciar();
  }, []);

  const iniciar = async () => {
    // modelos desde internet
    const URL = "https://justadudewhohacks.github.io/face-api.js/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(URL);

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

        const max = Object.keys(expresiones).reduce((a, b) =>
          expresiones[a] > expresiones[b] ? a : b
        );

        setEstado(max);
      }
    }, 3000);
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

      <h2>Estado detectado: {estado}</h2>
    </div>
  );
}
