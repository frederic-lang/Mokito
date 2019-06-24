function createCanvas() {
//  console.log("createCanvas");
  let canvas = document.createElement("canvas");
  canvas.setAttribute("width", "600");
  canvas.setAttribute("height", "300");
  return canvas;
}

function createRange(name, min , max, step, defaultValue) {
  let range = document.createElement("input");
  range.setAttribute("type", "range");
  range.setAttribute("name", name);
  range.setAttribute("min", min);
  range.setAttribute("max", max);
  range.setAttribute("step", step);
  range.setAttribute("onchange", "draw(this)")
  range.defaultValue = defaultValue;
  return range;
}

function createLabel(name) {
  let label = document.createElement("label")
  label.setAttribute("for", name);
  label.appendChild(document.createTextNode(name));
  return label;
}

function initCanvas(){
  let [pane] = document.getElementsByClassName("pane");
  pane.appendChild(createRange("scale", "0", "0.85", "0.01", 0.8));
  pane.appendChild(createLabel("scale"));
  pane.appendChild(createRange("angle", "0", "1", "0.01", 0.5));
  pane.appendChild(createLabel("angle"));
  pane.appendChild(createCanvas());
}


function branch(cx, length, angle, scale) {
  cx.fillRect(0,0,1,length);
  if (length < 8) return;
  cx.save();
  cx.translate(0, length);
  cx.rotate(-angle);
  branch(cx, length*scale, angle, scale);
  cx.rotate(2*angle);
  branch(cx, length*scale, angle, scale);
  cx.restore();
}

let length = 60;
let angle = 0.5;
let scale = 0.8;

function draw(range = null) {
  if (range) {
    if (range.name == "scale") scale = range.value;
    if (range.name == "angle") angle = range.value;
  }
  let cx = document.querySelector("canvas").getContext("2d");
  cx.clearRect(0, 0, 600, 300);
  cx.save();
  cx.translate(300,0);
  branch(cx, length, angle, scale);
  cx.restore();
}


//draw();