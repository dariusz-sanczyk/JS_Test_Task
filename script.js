document.addEventListener("DOMContentLoaded", function () {
  const audioFile = document.getElementById("audioFile");
  const audioPlayer = document.getElementById("audioPlayer");
  const cells = document.querySelectorAll(".cell");

  audioFile.addEventListener("change", handleFileSelect);

  let audioContext;
  let analyser;
  let dataArray;
  let source;

  function handleFileSelect(event) {
    const file = event.target.files[0];
    const objectUrl = URL.createObjectURL(file);
    audioPlayer.src = objectUrl;
    const reader = new FileReader();

    reader.onload = function (event) {
      const audioData = event.target.result;
      if (audioContext) {
        audioContext.close();
      }
      audioContext = new window.AudioContext();
      audioContext.decodeAudioData(audioData, function (buffer) {
        createAudioSource(buffer);
        visualize();
      });
    };

    reader.readAsArrayBuffer(file);
  }

  function createAudioSource(buffer) {
    source = audioContext.createBufferSource();
    source.buffer = buffer;

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.connect(audioContext.destination);
    source.connect(analyser);

    audioPlayer.srcObject = audioContext;
    audioPlayer.play();
  }

  function visualize() {
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    function draw() {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      cells.forEach((cell, index) => {
        const value = dataArray[index];
        const hue = (value / 255) * 360;
        cell.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
      });
    }

    draw();
  }
});
