import PaiComId from "./PaiComId";
import Grades from "./Grades";

class Caracteristicas extends PaiComId {
    // #region ATRIBUTOS
    private descricao: string;
    private grade: Grades;
    // #endregion

    // #region CONSTRUCTOR
    constructor(id: number = 0, descricao: string = "", grade: Grades = new Grades(), datacad: Date | string = new Date(), ultalt: Date | string = new Date()) {
        super();
        this.id = id;
        this.descricao = descricao;
        this.grade = grade;
        this.datacad = datacad;
        this.ultalt = ultalt;
    }
    // #endregion

    // #region GETTERS
    public get _descricao() {
        return this.descricao;
    }

    public get _grade() {
        return this.grade;
    }
    // #endregion

    // #region SETTERS
    public set _descricao(value: string) {
        this.descricao = value;
    }

    public set _grade(value: Grades) {
        this.grade = value;
    }
    // #endregion
}

export default Caracteristicas;