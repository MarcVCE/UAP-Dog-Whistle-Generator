function main() {
  let context;
  let nodes = [];
  let chirpInterval;
  let pingInterval;
  let mediaRecorder;
  let recordedChunks = [];

  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");
  const exportButton = document.getElementById("exportButton");
  const statusEl = document.getElementById("recordingStatus");

  startButton.onclick = () => {
    context = new (window.AudioContext || window.webkitAudioContext)();

    // Create MediaStreamDestination to record
    const dest = context.createMediaStreamDestination();
    mediaRecorder = new MediaRecorder(dest.stream);
    recordedChunks = [];

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "summoner_live.wav";
      a.click();
      URL.revokeObjectURL(url);

      statusEl.style.color = "green";
      statusEl.textContent = "✅ Recording finished, file downloaded";
    };

    buildSummonerSound(context, dest);

    startButton.disabled = true;
    stopButton.disabled = false;
    exportButton.disabled = false;
    statusEl.textContent = "";
  };

  stopButton.onclick = () => {
    nodes.forEach((n) => n.stop && n.stop());
    nodes = [];
    clearInterval(chirpInterval);
    clearInterval(pingInterval);
    startButton.disabled = false;
    stopButton.disabled = true;
  };

  exportButton.onclick = () => {
    const value = parseInt(document.getElementById("duration").value, 10);
    const unit = document.getElementById("durationUnit").value;
    let duration = value;
    if (unit === "minutes") duration *= 60;
    if (unit === "hours") duration *= 3600;

    if (!mediaRecorder) return;

    statusEl.style.color = "red";
    statusEl.textContent = "🔴 Recording…";

    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
    }, duration * 1000);
  };

  // -----------------------------
  // Build all layers
  // -----------------------------
  function buildSummonerSound(ctx, dest) {
    nodes = [];

    // Helper: connect both to speakers + recorder
    const connectOut = (node) => {
      node.connect(ctx.destination);
      node.connect(dest);
    };

    // 1. 7.83 Hz AM
    {
      const carrier = ctx.createOscillator();
      carrier.frequency.value = 100;

      const ampGain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      lfo.frequency.value = 7.83;
      lfoGain.gain.value = 0.5;

      lfo.connect(lfoGain);
      lfoGain.connect(ampGain.gain);

      carrier.connect(ampGain);
      connectOut(ampGain);

      lfo.start();
      carrier.start();
      nodes.push(carrier, lfo);
    }

    // 2. 528 Hz tone
    {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 528;
      osc.type = "sine";
      gain.gain.value = 0.05;
      osc.connect(gain);
      connectOut(gain);
      osc.start();
      nodes.push(osc);
    }

    // 3. 17 kHz pings
    {
      const ping = () => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 17000;
        gain.gain.value = 0.1;
        osc.connect(gain);
        connectOut(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      };
      pingInterval = setInterval(ping, 3000);
    }

    // 4. 2.5 kHz chirps
    {
      chirpInterval = setInterval(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(2500, ctx.currentTime);
        osc.type = "square";
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + 0.2
        );
        osc.connect(gain);
        connectOut(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        nodes.push(osc);
      }, 10000);
    }

    // 5. 432 Hz pad
    {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 432;
      osc.type = "triangle";
      gain.gain.value = 0.02;
      osc.connect(gain);
      connectOut(gain);
      osc.start();
      nodes.push(osc);
    }

    // 6. Breath layer
    {
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.03, ctx.currentTime);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.25;
      lfoGain.gain.value = 0.02;
      lfo.connect(lfoGain);
      lfoGain.connect(noiseGain.gain);

      whiteNoise.connect(noiseGain);
      connectOut(noiseGain);

      whiteNoise.start();
      lfo.start();
      nodes.push(whiteNoise, lfo);
    }
  }
}

function ready(fn) {
  if (document.readyState !== "loading") {
    fn();
    return;
  }
  document.addEventListener("DOMContentLoaded", fn);
}
ready(main);
