const faker = require("faker");
const fs = require("fs");

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

const agencies = [
  { id: "1", name: "Space X" },
  { id: "2", name: "United Launch Alliance"},
  { id: "3", name: "Arianespace" },
]

const generateAgency = () => {
  return agencies[Math.floor(rand(0, 3))];
};

const generateLocation = () => {
  return {
    latitude: rand(-90, 90),
    longitude: rand(-180, 180)
  }
}

const generateLaunchWindow = (rangeStart, rangeEnd) => {
  const windowStart = new Date(rand(rangeStart.getTime(), rangeEnd.getTime()));
  const end = windowStart.getTime() + (rand(0.5, 1.5)*60*60*1000)
  const windowEnd = new Date(end);
  return {
    window_start: windowStart.toISOString(),
    window_end: windowEnd.toISOString()
  }
}

const generateStatus = () => {
  return `${Math.floor(rand(3, 5))}`;
}

const generateLaunches = (amount) => {
  return Array(amount).fill(null).map((_, index) => {
    const agency = generateAgency();
    return {
      id: index,
      name: faker.vehicle.vehicle(),
      launch_service_provider: {
        id: agency.id,
        name: agency.name
      },
      pad: generateLocation(),
      status: generateStatus(),
      ...generateLaunchWindow(
        new Date("2017-1-1"),
        new Date("2022-1-1")
      )
    }
  }).sort((a, b) => {
    return (a.window_start < b.window_start) ? -1 : ((a.window_start > b.window_start) ? 1 : 0);
  })
}

fs.writeFileSync("./src/__fixtures__/launches.json", JSON.stringify(generateLaunches(100), null, 2));