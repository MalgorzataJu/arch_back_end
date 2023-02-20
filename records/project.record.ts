import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db"
import {v4 as uuid} from "uuid";
import {FieldPacket} from "mysql2";

type ProjectRecordResults = [ProjectRecord[], FieldPacket[]];

export class ProjectRecord{
    id?: string;

    public readonly name: string;
    public readonly description: string;
    public readonly startDate:string;
    public readonly endDate:string;
    public readonly quantityHours:string;
    public readonly contact:string;

//omit w tym miejscu bierze instancję tego typu i tworzy na szybko typ (podtyp) bez tych dwóch wymienionych metod
    constructor(obj: Omit<ProjectRecord, 'insert' | 'update'>) {
        const {id, name, description, contact, startDate, endDate, quantityHours} = obj;

        if ( name.length < 3 && name.length> 50){
            throw new ValidationError(`Nazwa projektu musi posiadać min 3 max 55 znaków. Aktualnie jest to ${name.length}.`)
        }

        if ( description.length < 3 ){
            throw new ValidationError(`Opis musi być dłuższy niż 3 znaki. Aktualnie jest to ${description.length}.`)
        }

        this.id = id ?? uuid();
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.quantityHours = quantityHours;
        this.contact = contact;

    }

    async insert():Promise<string> {

        await pool.execute('INSERT INTO `project`(`id`, `name`, `description`, `startDate`, `endDate`, `quantityHours`, `contact`) VALUES(:id, :name, :description, :startDate, :endDate, :quantityHours, :contact )', {
            id: this.id,
            name: this.name,
            description: this.description,
            startDate: this.startDate,
            endDate: this.endDate,
            quantityHours: this.quantityHours,
            contact: this.contact,
        });

        return this.id;
    }

    async update():Promise<void> {
        await pool.execute("UPDATE `project` SET `wins` =:wins WHERE `id` =:id", {
            id: this.id,
        });
    }

    ///static dlatego że nie szuka w jednym konkretnym tylko we wszystkich znajdu rekord wojownika :D
    static async getOne(id: string): Promise<ProjectRecord | null>{
        const [results] = await pool.execute("SELECT * FROM `employee` WHERE `id` = :id", {
            id,
        }) as ProjectRecordResults;

        return results.length === 0 ? null: new ProjectRecord(results[0]);
    }

    static async listAll(): Promise<ProjectRecord[]>{
        const [results] = (await pool.execute("SELECT * FROM `project` ORDER BY NAME")) as ProjectRecordResults;
        return results.map(obj => new ProjectRecord({
                ...obj,
                startDate:(new Date(obj.startDate)).toLocaleDateString(),
                endDate:(new Date(obj.endDate)).toLocaleDateString(),
        }
        ));
    }

    static async isNameTaken(name: string):Promise<boolean> {
        const [results] = await pool.execute("SELECT * FROM `project` WHERE `name` = :name", {
            name,
        }) as ProjectRecordResults;

        return results.length > 0;
    }


}