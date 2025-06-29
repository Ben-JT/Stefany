document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = []; // Definimos las velas aquí, dentro del evento DOMContentLoaded
  let audioContext;
  let analyser;
  let microphone;
  let audio = new Audio('Rosa Linn - Snap .mp3');

  // Función para actualizar la cuenta de velas
  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
  }

  // Función para agregar una vela cuando se hace clic
  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  // Evento de clic para agregar velas
  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  // Función para detectar si se está soplando
  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 50; // Ajusta este valor si es necesario
  }

  // Función para apagar las velas
  function blowOutCandles() {
    let blownOut = 0;

    // Solo verificamos si hay velas y al menos una no está apagada
    if (candles.length > 0 && candles.some((candle) => !candle.classList.contains("out"))) {
      if (isBlowing()) {
        candles.forEach((candle) => {
          if (!candle.classList.contains("out") && Math.random() > 0.5) {
            candle.classList.add("out");
            blownOut++;
          }
        });
      }

      if (blownOut > 0) {
        updateCandleCount();
      }

      // Si todas las velas están apagadas, activamos la celebración
      if (candles.every((candle) => candle.classList.contains("out"))) {
        setTimeout(function () {
          triggerConfetti();  // Activamos el confetti
          endlessConfetti(); // Confetti sin fin
          
          // Muestra el div con el texto y la imagen
          const box = document.getElementById("celebration-box");
          box.classList.add("show");
          
          // Reproducimos la música
          audio.play().catch((err) => {
            console.log("Error al reproducir la música:", err);
          });
        }, 200);
      }
    }
  }

  // Accede al micrófono del usuario para detectar el soplo
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
});

// Función para activar el confetti
function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Función para confetti sin fin
function endlessConfetti() {
  setInterval(function () {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0 }
    });
  }, 1000);
}
