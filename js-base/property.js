const obj = {
  name: "Jin hyeon",
  age: 29,
  getFamliyName: function () {
    return "Kim";
  },
  getLastName: () => "Park",
  getBloodType() {
    return "A";
  },
};

obj.name;
obj.age;
obj.booldType = "A";
delete obj.booldType;
obj.getFamliyName();
obj.getBloodType();

obj.age = 200;
obj.age = -500;

class Person {
  _booldType;
  constructor(booldType) {
    this._booldType = booldType;
  }
  //메서드
  //세팅
  set booldType(btype) {
    if (btype === "A" || btype == "B" || btype === "O" || btype == "AB") {
      this._booldType = btype;
    }
  }
  //값을 읽을 수게 해준다.
  get booldType() {
    return `${this._booldType}형`;
  }
}

const p1 = new Person("A");

p1.booldType;
p1.booldType = "C";
