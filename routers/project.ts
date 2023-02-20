import {Router} from "express";
import {ValidationError} from "../utils/errors";
import {ProjectRecord} from "../records/project.record";

export const projectRouter = Router();

projectRouter
    .get('/add-form', async(req, res) => {
        res.render('project/add-form')
    })
    .get('/list', async(req, res) => {
        const projectList = (await ProjectRecord.listAll()).map((project, index) => {
            return {
                place: index + 1,
                project,
            }
        });
        res.render('project/list',{
            projectList,
        })
    })
    .post('/',async (req, res) => {

        if (await ProjectRecord.isNameTaken(req.body.name)) {
            throw new ValidationError(`Nazwa projektu ${req.body.name} jest zajęte, wybierz inną`)
        }

        console.log(req.body)

        const project = new ProjectRecord({
            ...req.body,
        });
        console.log(project)
        const id = await project.insert()
        res.render('project/project-added',{
            id,
            name:project.name,
        })
    })