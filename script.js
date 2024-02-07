const audioFile = document.getElementById("audioFile");
const audioPlayer = document.getElementById("audioPlayer");

audioFile.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const objectUrl = URL.createObjectURL(file);
  audioPlayer.src = objectUrl;
});
