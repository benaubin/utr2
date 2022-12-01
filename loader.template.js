(async function (frameSrcURL) {
  const FRAME_ID = "ut-registration-2";
  if (document.getElementById(FRAME_ID))
    document.getElementById(FRAME_ID).remove();
  const frame = document.createElement("iframe");
  frame.id = FRAME_ID;
  frame.style =
    "position:fixed;width:100vw;height:100vh;top:0;left:0;right:0;bottom:0;z-index:10000;background:white";
  frame.srcdoc = "Loading...";
  frame.frameBorder = 0;
  document.body.appendChild(frame);
  frame.srcdoc = await (await fetch(frameSrcURL)).text();
})($FRAME_SOURCE_URL);
