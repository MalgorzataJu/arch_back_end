import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db"
import {v4 as uuid} from "uuid";
import {FieldPacket} from "mysql2";

type EmployeeRecordResults = [EmployeeRecord[], FieldPacket[]];

//klasa prezentująca pracownika, podstawowe informacje o nim
export class EmployeeRecord{
    id?: string;
    public readonly name: string;
    public readonly surname: string;
    public readonly email:string;

//omit w tym miejscu bierze instancję tego typu i tworzy na szybko typ (podtyp) bez tych dwóch wymienionych metod
    constructor(obj: Omit<EmployeeRecord, 'insert' | 'update'>) {
        const {id, name, surname, email} = obj;

        if ( name.length < 3 && name.length> 50){
            throw new ValidationError(`Imie musi posiadać od 3 do 50 znaków. Aktualnie jest to ${name.length}.`)
        }

        if ( surname.length < 3 && surname.length> 50){
            throw new ValidationError(`Nazwisko musi posiadać od 3 do 50 znaków. Aktualnie jest to ${surname.length}.`)
        }

        this.id = id ?? uuid();
        this.name = name;
        this.surname = surname;
        this.email = email;

    }

    async insert():Promise<string> {

        await pool.execute('INSERT INTO `employee`(`id`, `name`, `surname`, `email`) VALUES(:id, :name, :surname, :email)', {
            id: this.id,
            name: this.name,
            surname: this.surname,
            email: this.email,
        });

        return this.id;
    }

    async update():Promise<void> {
        await pool.execute("UPDATE `employee` SET `wins` =:wins WHERE `id` =:id", {
            id: this.id,
        });
    }

    static async getOne(id: string): Promise<EmployeeRecord | null>{
        const [results] = await pool.execute("SELECT * FROM `employee` WHERE `id` = :id", {
            id,
        }) as EmployeeRecordResults;

        return results.length === 0 ? null: new EmployeeRecord(results[0]);
    }

    static async listAll(): Promise<EmployeeRecord[]>{
        const [results] = (await pool.execute("SELECT * FROM `employee` ORDER BY NAME")) as EmployeeRecordResults;
        return results.map(obj => new EmployeeRecord(obj));
    }

    static async isNameTaken(name: string):Promise<boolean> {
        const [results] = await pool.execute("SELECT * FROM `employee` WHERE `name` = :name", {
            name,
        }) as EmployeeRecordResults;

        return results.length > 0;
    }
}