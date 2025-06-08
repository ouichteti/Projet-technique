export interface ITask {
  id?: number;
  label?: string;
  description?: string;
  completed?: boolean;
}

export class Task implements ITask {
  constructor(
    public id?: number,
    public label?: string,
    public description?: string,
    public completed?: boolean
  ) {}
}
