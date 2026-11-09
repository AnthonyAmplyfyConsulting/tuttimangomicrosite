const start = { x: 180, y: 23 };
const slotCenters = [60, 180, 300];
const prizes = [
  "$1 off",
  "$2 off",
  "Free small",
];
const rows = Array.from({ length: 7 }, (_, index) => ({
  y: 69 + index * 41,
  xs: index % 2 ? [35, 93, 151, 209, 267, 325] : [64, 122, 180, 238, 296],
}));

const pegs = document.querySelector("#pegs");
const ball = document.querySelector("#ball");
const drop = document.querySelector("#drop");
const reward = document.querySelector("#reward");
const slots = [...document.querySelectorAll(".slot")];
const status = document.querySelector("#status");
let roundActive = false;

for (const row of rows) {
  for (const x of row.xs) {
    const peg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    peg.setAttribute("cx", x);
    peg.setAttribute("cy", row.y);
    peg.setAttribute("r", "5.1");
    peg.classList.add("peg");
    pegs.append(peg);
  }
}

function buildDrop() {
  const contacts = [{ x: start.x, y: rows[0].y - 21 }];
  for (const row of rows.slice(1)) {
    const previous = contacts.at(-1);
    const reachable = row.xs.filter(x => Math.abs(x - previous.x) === 29);
    const x = reachable[Math.floor(Math.random() * reachable.length)];
    contacts.push({ x, y: row.y - 21 });
  }
  const last = contacts.at(-1);
  const winner = Math.min(2, Math.floor(last.x / 120));
  return { points: [start, ...contacts, { x: slotCenters[winner], y: 337 }], winner };
}

function moveBall(x, y, spin = 0) {
  ball.setAttribute("transform", `translate(${x} ${y}) rotate(${spin})`);
}

function animateDrop(points) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const end = points.at(-1);
    moveBall(end.x, end.y);
    return Promise.resolve();
  }

  return new Promise(resolve => {
    const segmentTime = 230;
    let started;
    function frame(now) {
      started ??= now;
      const progress = Math.min((now - started) / segmentTime, points.length - 1);
      const step = Math.min(Math.floor(progress), points.length - 2);
      const t = progress - step;
      const from = points[step];
      const to = points[step + 1];
      const x = from.x + (to.x - from.x) * t;
      const y = from.y + (to.y - from.y) * t * t - (step ? 30 * t * (1 - t) : 0);
      moveBall(x, y, (x - start.x) * 2.5);
      if (progress < points.length - 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}

drop.addEventListener("click", async () => {
  if (roundActive) return;
  roundActive = true;
  drop.disabled = true;
  drop.textContent = "Dropping…";
  status.textContent = "The mango is dropping.";
  const { points, winner } = buildDrop();
  await animateDrop(points);
  slots[winner].classList.add("winner");
  document.querySelector("#prize-title").textContent = prizes[winner];
  status.textContent = "";
  drop.textContent = "Drop mango";
  drop.disabled = false;
  reward.showModal();
});

document.querySelector("#again").addEventListener("click", () => reward.close());
reward.addEventListener("close", () => {
  slots.forEach(slot => slot.classList.remove("winner"));
  moveBall(start.x, start.y);
  roundActive = false;
  drop.focus();
});
