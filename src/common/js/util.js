/* export function shuffle(_arr) {
	let arr = _arr.splice()
	let len = arr.length
	for (let i = 0; i < len - 1; i++) {
		let arrIndex = Math.floor(Math.random() * (arr.length - i))
		let tamp = arr[arrIndex]
		arr[arrIndex] = arr[len - i - 1]
		arr[len - i - 1] = tamp
	}
	return arr
} */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}