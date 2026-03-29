import { publishFacade } from "@angular/compiler";

export class Funcionario {
    forEach(arg0: (obj: any, index: any, objs: any) => void) {
      throw new Error('Method not implemented.');
    }
    constructor(
        public id: number = 0,
        public email: string = "",
        public nome: string = "",
        public nasc: Date = new Date(),
        public senha: string = ""
    ){

    }
}
