import {Router} from "express";
import {EmployeeRecord} from "../records/employee.record";

export const employeeRouter = Router();

employeeRouter
    .get('/add-form', async(req, res) => {
        const employeeList =(await EmployeeRecord.listAll()).map((employee, index) => {
            return {
                place: index + 1,
                employee,
            }
        });
        res.render('employee/add-form',{
            employeeList,
        })
    })
    .get('/list', async(req, res) => {
        const employeeList =(await EmployeeRecord.listAll()).map((employee, index) => {
            return {
                place: index + 1,
                employee,
            }
        });
        res.json(employeeList);
    })

    .post('/',async (req, res) => {

        const employee = new EmployeeRecord({
            ...req.body,
        });
        const id = await employee.insert()
        res.render('employee/employee-added',{
            id,
            name:employee.name,
        })
    })