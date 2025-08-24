# 🛸 UAP Whistle Summoner 🎶

A browser-based audio experiment that generates layered tones, pings, chirps and ambient noise.  
Originally by **JasonWilde108** (v1.0.1).  
This fork extends it with browser compatibility, recording features and export options.

---

## 📌 Versions

- **v1.0.1** → Original release.  
- **v1.1.0** → Adapted to run directly in the browser (`index.html`, `style.css`, `main.js` linked).  
- **v1.2.0** → Added duration control, live recording to `.wav` using `MediaRecorder`, and a visual recording status indicator.

---

## 🚀 How to use

1. Clone or download this repository.  
2. Open `index.html` in your browser.  

### Controls
- **Start Summoning** → Starts generating the layered sounds.  
- **Stop** → Stops all sound layers.  
- **Duration + Unit** → Set how long you want to record (seconds / minutes / hours).  
- **Export to WAV** → Records the *exact* live audio (including intervals) and downloads it as a `.wav` file.  
  - While recording → shows **🔴 Recording…**  
  - When finished → shows **✅ Recording finished, file downloaded**

---

## 🎛 Layers

- **7.83 Hz AM** → Simulates Schumann resonance by modulating a 100 Hz tone.  
- **528 Hz** → Gentle harmonic tone.  
- **17 kHz Pings** → Subtle short pulses every 3 seconds.  
- **2.5 kHz Chirps** → Quick squawks every 10 seconds.  
- **432 Hz Pad** → Smooth ambient foundation.  
- **Breath Layer** → White noise shaped with a slow LFO to simulate breathing.  

---

## 📄 Credits

- **Origin** → [JasonWilde108](https://x.com/JasonWilde108/status/1910816547070685522?s=19)  
- **Reference / Inspiration** → [TalesOnTheGo](https://www.youtube.com/watch?v=Gbk63d_yb3k)

---

## 🛠️ Development

- **HTML/CSS/JS only** → no build tools required.  
- To test locally, just open `index.html` in a browser.  
- For deployment, push to GitHub Pages / Netlify / Vercel or serve with a local HTTP server:  

```bash
# Python
python -m http.server 8000

# Node
npx serve