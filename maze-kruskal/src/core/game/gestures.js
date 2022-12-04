export const GESTURES = {
    SWIPE_RIGHT: 0,
    SWIPE_LEFT: 1,
    SWIPE_UP: 2,
    SWIPE_DOWN: 3,
    SINGLE_TAP: 4,
    DOUBLE_TAP: 5,
    TP_SWIPE_RIGHT: 6,
    NONE_DETECTED: 7
};

export function gestureDetection(inputPlugin, callback, options = {}) {
    inputPlugin.on('pointerup', pointer => {
        callback(detectGesture(pointer, options));
    });
}

function detectGesture(pointer, options) {
    let swipeThreshold = options.swipeThreshold || 100;
    let time = (pointer.upTime - pointer.downTime) / 1000;
    let velocityX = (pointer.upX - pointer.downX) / time;
    let velocityY = (pointer.upY - pointer.downY) / time;
    let speedX = Math.abs(velocityX);
    let speedY = Math.abs(velocityY);

    let origin = {
        x: pointer.downX,
        y: pointer.downY
    };

    if (speedX > speedY && speedX > swipeThreshold) {
        if (velocityX > 0) {
            return {
                gesture: GESTURES.SWIPE_RIGHT,
                origin: origin
            };
        } else {
            return {
                gesture: GESTURES.SWIPE_LEFT,
                origin: origin
            };
        }
    } else if (speedY > speedX && speedY > swipeThreshold) {
        if (velocityY > 0) {
            return {
                gesture: GESTURES.SWIPE_DOWN,
                origin: origin
            };
        } else {
            return {
                gesture: GESTURES.SWIPE_UP,
                origin: origin
            };
        }
    }

    return {
        gesture: GESTURES.SINGLE_TAP,
        origin: origin
    }
}

function detectGestureNoTime(pointer, options) {
    let swipeThreshold = options.swipeThreshold || 50;
    let displacementX = pointer.upX - pointer.downX;
    let displacementY = pointer.upY - pointer.downY;
    let distanceX = Math.abs(displacementX);
    let distanceY = Math.abs(displacementY);

    if (distanceX > distanceY && distanceX > swipeThreshold) {
        if (displacementX > 0) {
            return GESTURES.SWIPE_RIGHT;
        } else {
            return GESTURES.SWIPE_LEFT;
        }
    } else if (distanceY > distanceX && distanceY > swipeThreshold) {
        if (displacementY > 0) {
            return GESTURES.SWIPE_DOWN;
        } else {
            return GESTURES.SWIPE_UP;
        }
    }

    return GESTURES.SINGLE_TAP;
}