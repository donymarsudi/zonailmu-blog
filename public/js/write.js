const img = document.querySelector("img"),
  inputImg = document.querySelector("input#img");

inputImg.addEventListener("change", () => {
  img.src = URL.createObjectURL(inputImg.files[0]);
});
