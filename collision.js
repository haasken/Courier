function rectanglesOverlap(rect1, rect2) {
	// Two upright rectangles
	var left1 = rect1.posX;
	var left2 = rect2.posX;
	var right1 = left1 + rect1.width;
	var right2 = left2 + rect2.width;
	var top1 = rect1.posY;
	var top2 = rect2.posY;
	var bottom1 = top1 + rect1.height;
	var bottom2 = top2 + rect2.height;
	
	if ((bottom1 > top2) &&
		(top1 < bottom2) &&
		(right1 > left2) &&
		(left1 < right2)) { 
	
		// The two objects' collision boxes overlap
		return true;
	}
	// The two objects' collision boxes do not overlap
	return false;
}