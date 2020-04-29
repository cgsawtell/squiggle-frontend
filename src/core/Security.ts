const SESSION_STORAGE_KEY = "token"

export class Security {
	private static _token:string = "";
	static set token (token:string) {
		this._token = token
		sessionStorage.setItem(SESSION_STORAGE_KEY, token)
	}
	static get token (){
		if(this._token === ""){
			const tokenFromSession = sessionStorage.getItem(SESSION_STORAGE_KEY)
			
			if (tokenFromSession !== null){
				this._token = tokenFromSession
			}
		}
		return this._token 
	}
}