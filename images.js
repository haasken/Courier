/* Force the loading of all the images.  I don't know why this is necessary.
 * For example, if you do this:
 *
 * 		backgroundRawImage = new Image("./images/background.png");
 *
 * the image will not load properly, and you can't draw it. But it you do this:
 *
 * 		backgroundRawImage = new Image();
 * 		backgroundRawImage.src = "./images/background.png";
 *
 * the image loads fine, and you can draw it. Why??
 */

// backgroundRawImage = new Image();
// backgroundRawImage.src = "./images/background.png";

/* Actually, it looks like the RegularImage will take care of this for me.  I don't
 * know why it wasn't working before.  I will keep the above comment in case it breaks. */
 
var IMAGES = {
	//background: new RegularImage(backgroundRawImage)
	background: new RegularImage("./images/background.png"),

	redCarUp: new RegularImage("./images/redCarUp.png"),
	redCarDown: new RegularImage("./images/redCarDown.png"),
	redCarLeft: new RegularImage("./images/redCarLeft.png"),
	redCarRight: new RegularImage("./images/redCarRight.png"),	

	blueCarUp: new RegularImage("./images/blueCarUp.png"),
	blueCarDown: new RegularImage("./images/blueCarDown.png"),
	blueCarLeft: new RegularImage("./images/blueCarLeft.png"),
	blueCarRight: new RegularImage("./images/blueCarRight.png"),

	pickupLocation: new AnimatedImage("./images/pickupLocation.png", 20, 20, 0, 0),
	dropoffLocation: new AnimatedImage("./images/dropoffLocation.png", 20, 20, 0, 0),

	calloutUpRight: new RegularImage("./images/calloutUpRight.png"),
	calloutDownLeft: new RegularImage("./images/calloutDownLeft.png")
};