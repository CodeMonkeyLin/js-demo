// 1--------
// let count = 1
// let setCount = () => {
//     count++
// }
// setTimeout(() => {
//     console.log('a', count)
// }, 1000)
// module.exports = {
//     count,
//     setCount
// }
// 2---------
// let obj = {
//     count: 1
// }
// let setCount = () => {
//     obj.count++
// }
// setTimeout(() => {
//     console.log('a', obj.count)
// }, 1000)
// module.exports = {
//     obj,
//     setCount
// }
// 3---------
// var bar = require("./b.js");
// function foo() {
//     console.log('foo');
//     bar();
//     console.log('执行完毕');
// }
// module.exports = foo()
// foo();