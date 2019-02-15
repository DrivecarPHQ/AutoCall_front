import ajax from './ajax'

export default (type='GET', url='', data={}, addWrap = true) => {
	if (addWrap) {
		data = {jsonStrParams: JSON.stringify(data)}
	}
	url = `/api/${url}`
	return ajax(type, url, data)
}
