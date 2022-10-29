function MyFn(x) {
  return x + 100;
}

function sum(a, b, ...args) {
  let s = 0;
  for (let i = 0; i < args.length; i++) {
    s = s + args[i];
  }

  return s;
}

const sumV2 = (a, b, ...args) => {
  let s = 0;
  for (let i = 0; i < args.length; i++) {
    s = s + args[i];
  }
  return s;
};

const ten = (x) => 100 + x;
ten(10);
const abcSum = sum(10, 20, 30, 40, 50);
const result = MyFn(123, 20);

//익명 함수
const myFnV2 = function () {
  return 100;
};

const arr = [10, 20, 30, 40];
myFnV2();
sum.call(null, 10, 20, 30);
sum.apply(null, arr);

(function () {
  console.log("즉시 실행 함수");
})();

function* gen() {
  yield 10;
  yield 20;
  return 30;
}

const g = gen();

g.next();
g.next();
g.next();
