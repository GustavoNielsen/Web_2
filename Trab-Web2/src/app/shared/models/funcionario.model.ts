import { publishFacade } from "@angular/compiler";

export class Funcionario {
form: any;
    constructor(
        public id: number = 0,
        public email: string = "",
        public nome: string = "",
        public nasc: string = "",
        public senha: string = ""
    ){

    }
}
