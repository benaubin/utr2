(async function (frameSrcURL) {
  const frameSrc = await (await fetch(frameSrcURL)).text();
  document.open();
  document.write(frameSrc);
  document.close();
})($FRAME_SOURCE_URL);
