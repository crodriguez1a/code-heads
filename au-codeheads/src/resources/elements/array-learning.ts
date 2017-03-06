import {bindable} from 'aurelia-framework';

export class ArrayLearning {
  @bindable model = [];

  constructor(
    public arrayMaze: Array<any>
  ) {
    this.arrayMaze = [
      [0, 0, 0, 1],
      [0, 1, 0, 1],
      [0, 0, 1, 1]
    ]
  }

  valueChanged(newValue, oldValue) {

  }
}
