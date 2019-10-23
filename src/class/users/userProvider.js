export class UserProvider {

  	constructor (
		userId,
		email,
		fullName,
		avatar,
		providerId,
		provider,
		accessToken
	) {
  		this.userId = userId
  		this.email = email
  		this.fullName = fullName
  		this.avatar = avatar
  		this.providerId = providerId
  		this.provider = provider
  		this.accessToken = accessToken
  	}
}
