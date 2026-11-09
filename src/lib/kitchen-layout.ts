// IKEA planner layout, November 2026. Metres from the model's left inner wall.
// Five 60 cm base modules; fridge against the end of the short service wall.
// Connection drawing: KO at 1.930 m; water/drain are only shown schematically.
export const kitchen = {
 leftWall: -4.66,
 moduleWidth: .60,
 // FAB32 envelope: 601 × 1968 × 768 mm including handle. Back clearance is
 // provisional; check the selected appliance's installation requirements.
 fridgeX: -.894,
 fridgeZ: -1.9655,
 fridgeWallX: -.445,
 fridgeWallStartZ: -1.965,
 fridgeRotation: -Math.PI/2,
 fridgeWidth: .601,
 fridgeHeight: 1.968,
 fridgeDepth: .768,
 leftWorktopX: -3.205,
 hobX: -2.605,
 dishwasherX: -2.005,
 sinkX: -1.405,
 rightWorktopX: -.805,
 worktopHeight: .95,
};
