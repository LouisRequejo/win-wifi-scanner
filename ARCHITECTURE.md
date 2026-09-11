# Arquitectura: WIN Wi-Fi Scanner (Reto 01)

## Objetivo
Aplicación Web (PWA) orientada a la fricción cero. Permite a los usuarios medir la calidad del internet ambiente por ambiente en su casa usando únicamente su navegador móvil y enviando el reporte final a WIN.

## Stack Tecnológico Seleccionado
- **Framework:** React 18 (Estructura de vistas dinámicas y manejo de estado de mediciones)
- **Bundler:** Vite (Rápido, moderno y fácil de compilar para GitHub Pages)
- **Estilos:** Tailwind CSS v4 (Desarrollo ágil de UI mobile-first)
- **Despliegue:** GitHub Pages vía GitHub Actions.

## Estructura de Carpetas Propuesta

```text
src/
├── components/       # Componentes visuales reutilizables (Botones, Tarjetas, Modales)
├── views/            # Pantallas principales del flujo
│   ├── WelcomeView.jsx          # Gancho y llamada a la acción inicial
│   ├── RoomSelectorView.jsx     # El usuario elige qué zonas de su casa medirá
│   ├── MeasureView.jsx          # La vista principal al caminar ("Mide tu Sala")
│   └── ResultView.jsx           # Mapa de calor/Veredicto final e incentivo
├── services/         # Lógica de negocio dura (Desacoplada de UI)
│   ├── networkService.js        # Funciones que miden latencia y descargan payloads
│   └── apiService.js            # Mock del envío de datos a los sistemas de WIN (JSON)
├── context/          # Manejo de estado global
│   └── AppContext.jsx           # Guarda las zonas seleccionadas y los resultados obtenidos
├── App.jsx           # Router simple / Orquestador de Vistas
└── main.jsx          # Punto de entrada de React
```

## Flujo de Datos y Estados
El sistema opera sobre una máquina de estados finita (FSM) a nivel de la App:
`WELCOME` -> `SELECT_ROOMS` -> `MEASURING` -> `RESULTS`

El estado global (`AppContext`) guarda:
```json
{
  "selectedRooms": ["Sala", "Dormitorio 1"],
  "currentRoomIndex": 0,
  "measurements": [
     { "room": "Sala", "ping": 45, "speed": 120, "status": "good" }
  ]
}
```

## Despliegue a GitHub Pages
Se ha configurado un workflow de GitHub Actions (`.github/workflows/deploy.yml`).
Cuando el código se integre a la rama `main` y se suba a GitHub (push), GitHub Actions:
1. Instalará dependencias.
2. Compilará el proyecto.
3. Desplegará la carpeta `dist/` a la rama `gh-pages` de forma automática.

## Instrucciones para el próximo agente
- Empezar creando los mocks visuales en `views/`.
- Implementar la lógica de medición simulada en `services/networkService.js` (un `setTimeout` que retorne números aleatorios basados en la realidad).
- Unir todo usando el contexto en `App.jsx`.
