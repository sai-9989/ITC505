const storyData = {
  start: {
    text: "You awaken inside a crashed spacecraft on Mars. The oxygen alarm blares. Outside, the red dust swirls under two moons. Do you try to repair your ship or explore the planet?",
    choices: [
      { text: "Attempt to Repair Ship", next: "repair" },
      { text: "Step Outside to Explore", next: "explore" }
    ],
    image: "images/start_mars.jpg"
  },
  // --- Repair Path ---
  repair: {
    text: "You open the control panel. The circuits are fried. You spot a spare power cell outside near the crater. Do you risk going out or try to reroute internal power?",
    choices: [
      { text: "Go Outside for Power Cell", next: "powercell" },
      { text: "Reroute Internal Power", next: "reroute" }
    ],
    image: "images/ship_inside.jpg"
  },
  powercell: {
    text: "You grab the power cell, but a sandstorm approaches fast. Do you rush back to the ship or seek shelter under a nearby rock formation?",
    choices: [
      { text: "Rush Back to Ship", next: "ending1" },
      { text: "Hide Under Rocks", next: "ending2" }
    ],
    image: "images/sandstorm.jpg"
  },
  reroute: {
    text: "You reroute internal circuits. Sparks fly! You lose consciousness briefly and awaken to silence. Oxygen is low. Do you check the exterior or send a distress signal?",
    choices: [
      { text: "Check Exterior", next: "ending3" },
      { text: "Send Distress Signal", next: "ending4" }
    ],
    image: "images/control_panel.jpg"
  },
  // --- Explore Path ---
  explore: {
    text: "You step onto the Martian surface. The gravity feels light. You see a glowing cave nearby and a metallic glint on the horizon. Where do you go?",
    choices: [
      { text: "Enter the Glowing Cave", next: "cave" },
      { text: "Head Toward the Metallic Glint", next: "signal" }
    ],
    image: "images/mars_surface.jpg"
  },
  cave: {
    text: "Inside the cave, strange crystals hum softly. The deeper you go, the brighter they get. Do you touch one or collect a sample?",
    choices: [
      { text: "Touch the Crystal", next: "ending5" },
      { text: "Collect a Sample", next: "ending6" }
    ],
    image: "images/cave_crystals.jpg"
  },
  signal: {
    text: "You reach a crashed alien drone. It’s partly functional. Do you repair it or dismantle it for parts?",
    choices: [
      { text: "Repair the Drone", next: "ending7" },
      { text: "Dismantle for Parts", next: "ending8" }
    ],
    image: "images/alien_drone.jpg"
  },
  // --- Endings ---
  ending1: {
    text: "You reach your ship just in time and install the power cell. Engines roar to life — you escape Mars, a true survivor! 🛸",
    choices: [],
    image: "images/escape.jpg"
  },
  ending2: {
    text: "The storm buries you in dust. Decades later, explorers find your fossilized suit — a Martian legend. 💀",
    choices: [],
    image: "images/storm_end.jpg"
  },
  ending3: {
    text: "You exit to find Earth’s rescue ship landing nearby. You wave as they approach. You’re saved! 🌍",
    choices: [],
    image: "images/rescue_ship.jpg"
  },
  ending4: {
    text: "You send a signal, but it drains your last oxygen reserves. The stars fade. Your message drifts forever in space. 🛰️",
    choices: [],
    image: "images/space_signal.jpg"
  },
  ending5: {
    text: "The crystal absorbs your touch and merges with you — you become the first Martian life form. 👽",
    choices: [],
    image: "images/crystal_glow.jpg"
  },
  ending6: {
    text: "You collect a sample and return safely. The crystal cures diseases on Earth. Humanity remembers your name. 🧬",
    choices: [],
    image: "images/sample_success.jpg"
  },
  ending7: {
    text: "You fix the alien drone. It activates and teleports you to an interstellar civilization. You live among the stars! 🌌",
    choices: [],
    image: "images/alien_world.jpg"
  },
  ending8: {
    text: "You take the drone apart, but trigger a defense protocol — a laser blast ends your adventure instantly. ⚡",
    choices: [],
    image: "images/explosion.jpg"
  }
};

// ---------- Functions ----------
let currentStage = "start";

function startGame() {
  currentStage = "start";
  updatePage();
}

function updatePage() {
  const stage = storyData[currentStage];
  document.getElementById("story").textContent = stage.text;

  const img = document.getElementById("storyImage");
  img.src = stage.image;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  if (stage.choices.length === 0) {
    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Restart Adventure";
    restartBtn.onclick = startGame;
    choicesDiv.appendChild(restartBtn);
    return;
  }

  stage.choices.forEach(choice => {
    const button = document.createElement("button");
    button.textContent = choice.text;
    button.onclick = () => {
      currentStage = choice.next;
      updatePage();
    };
    choicesDiv.appendChild(button);
  });
}

window.onload = startGame;
