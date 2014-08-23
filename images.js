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
	background: new RegularImage("./images/background.png")
};