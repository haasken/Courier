/* Create a new Timer that will run for the given number of seconds. */
var Timer = function(seconds) {
	this.secondsRemaining = seconds;
	/* Get the current time in milliseconds. */
	var currentTime = new Date().getTime();
	/* Set the expireTime in milliseconds. */
	this.expireTime = currentTime + seconds * 1000;
}

Timer.prototype.isExpired = function() {
	var currentTime = new Date().getTime();
	return currentTime > this.expireTime;
}

Timer.prototype.getSecondsRemaining = function() {
	var currentTime = new Date().getTime();
	return (this.expireTime - currentTime) / 1000;
}