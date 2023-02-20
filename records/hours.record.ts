import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db"
import {v4 as uuid} from "uuid";
import {FieldPacket} from "mysql2";

type HourRecordResults = [HourRecord[], FieldPacket[]];
//klasa preentująca godziny pracy pracownika
export class HourRecord{
    id?: string;
    public readonly projectId: string;
    public readonly employeeId: string;
    public readonly warkhourId : string;
    public readonly quantity:string;
    public readonly date:string;
    public readonly timeAd:string;

//omit w tym miejscu bierze instancję tego typu i tworzy na szybko typ (podtyp) bez tych dwóch wymienionych metod
    constructor(obj: Omit<HourRecord, 'insert' | 'update'>) {
        const {id, projectId, employeeId, warkhourId, quantity, date, timeAd} = obj;

        if ( quantity.length < 0 ){
            throw new ValidationError(`Ilośc godzin przepracowanych musi być większa od zera ${quantity.length}.`)
        }

        const dateTime = new Date().toLocaleDateString();
        this.id = id ?? uuid();
        this.projectId  = projectId ;
        this.employeeId  = employeeId ;
        this.warkhourId   = warkhourId  ;
        this.quantity = quantity;
        this.date = date;
        this.timeAd =timeAd ??  dateTime;

    }

    async insert():Promise<string> {

        await pool.execute('INSERT INTO `hour`(`id`, `projectId`, `employeeId`, `warkhourId`, `quantity`, `date`, `timeAd`) VALUES(:id, :projectId, :employeeId, :warkhourId, :quantity, :date, :timeAd)', {
            id: this.id,
            projectId: this.projectId,
            employeeId: this.employeeId,
            warkhourId: this.warkhourId,
            quantity: this.quantity,
            date: this.date,
            timeAd: this.timeAd,
        });

        return this.id;
    }

    static async getOne(id: string): Promise<HourRecord | null>{
        const [results] = await pool.execute("SELECT * FROM `hour` WHERE `id` = :id", {
            id,
        }) as HourRecordResults;

        return results.length === 0 ? null: new HourRecord(results[0]);
    }

    static async listAll(): Promise<HourRecord[]>{
        const [results] = (await pool.
        execute(
            "SELECT h.id, p.name projectId, e.name employeeId, w.hourstype warkhourId, h.quantity, h.date, h.timeAd FROM `hour` h JOIN `project` p ON h.projectId = p.id JOIN `employee` e ON h.employeeId = e.id JOIN `workhour` w ON h.warkhourId = w.id")) as HourRecordResults;
            return results.map(obj => new HourRecord({
                ...obj,
                // date:new Date(obj.date).toLocaleDateString(),
                // timeAd:new Date(obj.timeAd).toLocaleDateString(),
            }));
    }
    //zlicz ilość godzin pracownika
    static async countHour(id:string): Promise<HourRecord[] | null>{
        const [results] = await pool.execute(
            "SELECT h.id, p.name projectId, e.name employeeId, e.id, w.hourstype warkhourId, h.quantity, h.date, h.timeAd FROM `hour` h JOIN `project` p ON h.projectId = p.id JOIN `employee` e ON h.employeeId = e.id JOIN `workhour` w ON h.warkhourId = w.id WHERE employeeId = :id ", {
            id,
        }) as HourRecordResults;
        return  results.length === 0 ? null: results.map(obj => new HourRecord({
            ...obj,
            // date:new Date(obj.date).toLocaleDateString(),
            // timeAd:new Date(obj.timeAd).toLocaleDateString(),
        }));
    }

}