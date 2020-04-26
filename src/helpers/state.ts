export function withState<State extends object>(initialState: State, onChange:(updatedState: State) => void) {
	return new Proxy(
		initialState,
		{
			set: function (target: State, prop: keyof State, value: any, receiver: any) {
				target[prop] = value;
				onChange(target);
				return true
			},
			deleteProperty: function (target: State, prop: keyof State) {
				delete target[prop];
				onChange(target);
				return true
			}
		}
	);
}