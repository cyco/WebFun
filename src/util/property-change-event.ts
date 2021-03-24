class PropertyChangeEvent extends CustomEvent<{ property: any; value: any; target: any }> {
	public static readonly type = "propertyChanged";

	public constructor(property: any, value: any, target: any) {
		super(PropertyChangeEvent.type, { detail: { property, value, target } });
	}
}

export default PropertyChangeEvent;
