/* Set the state of the game to the main menu to start. */
var currentLoop = LOOPS.menu;
var currentGameState = STATES.inProgress;

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

/* Time in seconds for deliveryLocations to expire */
var deliveryExpirationSeconds = 10;