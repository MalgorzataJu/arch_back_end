import {Router} from "express";
import {EmployeeRecord} from "../records/employee.record";
import {ProjectRecord} from "../records/project.record";
import {WorkHourRecord} from "../records/workhours.record";
import {HourRecord} from "../records/hours.record";


export const hourRouter = Router();

hourRouter
    //tu nie muszą być otypowane, ponieważ to tylko collbac który nie jest wykorzystywany na zwenątrz funkcji
    .get('/add-form', async(req, res) => {
        const projectList = await ProjectRecord.listAll();
        const employeeList = await EmployeeRecord.listAll();
        const workhours = await WorkHourRecord.listAll();

        // res.render('hour/add-form', {
        //     projectList,
        //     employeeList,
        //     workhours,
        // });

        res.json({projectList, employeeList, workhours})

    })
    .get('/list', async(req, res) => {
        const hourList = (await HourRecord.listAll()).map((hour, index) => {
            return {
                place: index + 1,
                hour,
            }
        });
        res.render('hour/list',{
            hourList,
        })
    })
    .get('/godziny',async (req, res) => {

        const hourList = (await HourRecord.countHour('754dbb49-849e-4185-8696-5a7ad92a85cf')).map((hour, index) => {
            return {
                place: index + 1,
                hour,
            }
        });
        console.log('hourListEm',hourList);

        res.render('hour/list', {
            hourList,
        });

    })
    .post('/',async (req, res) => {
        const hour = new HourRecord({
            ...req.body,
        });
        const id = await hour.insert();
        res.json(id);
    })