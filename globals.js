/* How often the update loop is executed, in milliseconds/loop. */
var updateInterval = 60;

/* Set the state of the game to the main menu to start. */
var currentLoop = LOOPS.menu;
var currentGameState = STATES.inProgress;

/* How long to wait after a crash to show the game over screen, in seconds. */
var restartWaitSeconds = 1;
/* loops = seconds * (1000ms / second) * (loops / ms) */
var restartWaitLoops = restartWaitSeconds * 1000 / updateInterval;
var loopsWaited = 0;

var canvas, context;

/* The canvas width and height to be set when the onLoad() callback is executed. */
var canvasWidth;
var canvasHeight;

/* Margin between the grid and the left and upper edges of the level */
var levelMargin = 20;

/* Width and height of the grid, calculated in onLoad() */
var gridWidth, gridHeight;

/* Space between grid lines. */
var gridSpacing = 80;
/* Set to true to enable drawing the grid lines. */
var drawGrid = false;

var scoreboardHeight = 60;

/* The grid, courier, and scoreboard are instantiated after the above variables
 * are calculated in onLoad(). */
var grid;
var courier;
var scoreboard;

var controller = new Controller();
var pickupLocations = new Array();
var dropoffLocations = new Array();

/* The number of packages successfully dropped off in total */
var totalDropoffs = 0;
/* The number of dropoffs after which a new blue car will be spawned. */
var addCarInterval = 8;
var carAdded = true;

/* Other cars that you don't want to run into. */
var otherCars = new Array();

/* Time in seconds for deliveryLocations to expire */
var deliveryExpirationSeconds = 10;