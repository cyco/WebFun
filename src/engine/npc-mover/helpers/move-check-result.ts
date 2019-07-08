enum MoveCheckResult {
	OutOfBounds = -1,
	Free = 1,
	Blocked = 0,
	EvadeRight = 2,
	EvadeLeft = 3,
	EvadeDown = 4,
	EvadeUp = 5
}

export default MoveCheckResult;
