import wretch from "wretch";

export const api = wretch("/api/")
	.defer((w, url, options) => {
		if (typeof options?.context?.token !== "undefined") {
			const { token } = options.context;
			return w.auth(`Bearer ${token}`);
		}
		return w;
	})
	.options({ credentials: "include"});
