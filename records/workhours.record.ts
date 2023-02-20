import {pool} from "../utils/db"
import {v4 as uuid} from "uuid";
import {FieldPacket} from "mysql2";

type WorkHourRecordResults = [WorkHourRecord[], FieldPacket[]];

//rodzaje godzin pracy
export class WorkHourRecord{
    id?: string;
    public readonly hourstype: string;

    constructor(obj: Omit<WorkHourRecord, 'insert' | 'update'>) {
        const {id, hourstype} = obj;

        this.id = id ?? uuid();
        this.hourstype = hourstype;
    }

    async insert():Promise<string> {

        await pool.execute('INSERT INTO `workhour`(`id`, `hourstype`) VALUES(:id, :hourstype)', {
            id: this.id,
            hourstype: this.hourstype,
        });

        return this.id;
    }

    static async listAll(): Promise<WorkHourRecord[]>{
        const [results] = (await pool.execute("SELECT * FROM `workhour` ORDER BY hourstype")) as WorkHourRecordResults;
        return results.map(obj => new WorkHourRecord(obj));
    }
}