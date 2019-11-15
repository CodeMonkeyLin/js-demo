## BigInt
> BigInt 是一种内置对象，可以表示大于 2的53次方 的整数。而在Javascript中，Number 基本类型可以精确表示的最大整数是 2的53次方。BigInt 可以表示任意大的整数。
### 问题
JS 中的Number类型只能安全地表示-9007199254740991 (-(2^53-1)) 和9007199254740991(2^53-1)之间的整数，任何超出此范围的整数值都可能失去精度。
```js
const maxInt = Number.MAX_SAFE_INTEGER;

console.log(maxInt + 1);        

console.log(maxInt + 2);     // → -9007199254740996
```
>JS 提供Number.MAX_SAFE_INTEGER常量来表示 最大安全整数，Number.MIN_SAFE_INTEGER常量表示最小安全整数：

### 解决
```js
const previousMaxSafe = BigInt(Number.MAX_SAFE_INTEGER);
// ↪ 9007199254740991n

const maxPlusOne = previousMaxSafe + 1n;
// ↪ 9007199254740992n
console.log(maxPlusOne);
const theFuture = previousMaxSafe + 2n;
// ↪ 9007199254740993n, this works now!
console.log(theFuture)
```
### 语法
```js
BigInt(value);
```
或者在整数的末尾追加n即可

### 类型信息
```js
typeof 1n === 'bigint'; // true
typeof BigInt('1') === 'bigint'; // true
```
###比较
BigInt 和 Number 不是严格相等的，但是宽松相等的。
```js
0n === 0
// ↪ false

0n == 0
```
Number 和 BigInt 可以进行比较。
```js
1n < 2
// ↪ true

2n > 1
// ↪ true

2 > 2
// ↪ false

2n > 2
// ↪ false

2n >= 2
// ↪ true
```
### 注意点
```js
25 / 10;      // → 2.5
25n / 10n;   

BigInt("10");    // → 10n
BigInt(10);      // → 10n
BigInt(true);    // → 1n

BigInt(10.2);     // → RangeError
BigInt(null);     // → TypeError
BigInt("abc");    // → SyntaxError

1n + 1
```
BigInt 不能与 Number类型互相运算

## 参考
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt

## require与imoprt的区别
require遵循的是commonjs规范，import遵循的是es6module规则。

- 区别1：require的过程是赋值过程，通过require引入基础数据类型时，属于复制该变量。通过require引入复杂数据类型时，数据浅拷贝该对象。
```js
//基本类型导入示例代码如下：
// a.js
let count = 1
let setCount = () =>{
  count++
}
setTimeout(() =>{
  console.log('a', count)
}, 1000)
module.exports = {
  count,
  setCount
}
// b.js
let obj = require('./a.js')

obj.setCount()
console.log('b', obj.count)

//node b.js
//b 1
//a 2  
//可以看出，count在b.js文件中复制了一份，
//setCount只改变了a.js中count值
```
```js
//关于对象的导入示例代码如下：

// a.js
let obj = {
  count: 1
}
let setCount = () =>{
  obj.count++
}
setTimeout(() =>{
  console.log('a', obj.count)
}, 1000)
module.exports = {
  obj,
  setCount
}
// b.js
let data = require('./a.js')

data.setCount()
console.log('b', data.obj.count)

//node b.js
//b 2
//a 2
//从以上可以看出，a.js和b.js实际上指向同一个obj对象
```
import的导入过程是解构过程，并且是强绑定的。
1. 不管是基础（复杂）数据类型，都只是对该变量的动态只读引用。
2. 动态在于一个模块中变量的变化会影响到另一个模块；只读在于从某个模块引入一个变量时，不允许修改该变量的值。对于复杂数据类型，可以添加属性和方法，但是不允许指向另一个内存空间。
这里要强调一点用import导入的数据被变量接收后，这些变量类似用const定义过，都是只读的，不允许重新赋值，引用类型可以增删修改属性。
代码如下：
```js
//a1.js
let a  = 100;
export {a};
//b1.js 
import {a} from "./a1.js";
a = 200;
// 代码会报错
```
- 区别2、es6module引用基本类型是动态引用的，被引入文件的数据发生变化，会影响引入文件
```js
//a1.js

let count = 1
function setcount(){
    count ++
}
setTimeout(() => {
  console.log('a', count)
}, 1000)
export {
  count,
  setcount
}

//b1.js
import {count,setcount} from "./a1.js";
setcount();
console.log(count);

// babel-node --presets env b1.js
// b 2
// a 2
```
- 区别3、require使用的位置比较随意，比方说可以在函数内部使用，而import只能在文件作用域最外层使用。否则会报错：
即使用在if判断语句中也会出错：
这点require就比较灵活了。
- 区别4，对于循环引用的处理：
require循环加载时，属于加载时执行。即脚本代码在require的时候，就会全部执行。一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。
>import循环加载时，ES6模块是动态引用。只要两个模块之间存在某个引用，代码就能够执行，也就是可能会陷入死循环。
代码如下：
```js
// b1.js
import {foo} from './a1.js';
export function bar() {
  console.log('bar');
    foo();
}

// a1.js
import {bar} from './b1.js';
export function foo() {
  console.log('foo');
  bar();
  console.log('执行完毕');
}
foo();
// 上面代码就会陷入死循环
```

改成commonjs规范来写如下：

```js
//b.js
var foo = require("./a.js");
function bar() {
    console.log('bar');
    foo();
  }
module.exports= bar

//a.js
var bar = require("./b.js");
function foo() {
    console.log('foo');
    bar();
    console.log('执行完毕');
  }
module.exports = foo()
foo();
// 以上代码，不会陷入死循环，但是会导致a.js提前导出
```
- 区别5，require是一个函数，在使用时传入的参数可以动态计算，例如：
> require（“./”+"a.js"）这样使用不会报错，但是如果使用 import “./”+"a.js"，就会出现问题。