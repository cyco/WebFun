enum EvaluationMode {
	Initialize = 1 << 0,
	JustEntered = 1 << 1,
	ByPlane = 1 << 2,

	Bump = 1 << 3,
	Walk = 1 << 4,
	PlaceItem = 1 << 5
}

export default EvaluationMode;
