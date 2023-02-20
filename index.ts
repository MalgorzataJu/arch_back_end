import express, {json, Router} from "express";
import cors from "cors";
import 'express-async-errors';
import rateLimit from "express-rate-limit";
import {config} from "./config/config";
import {homeRouter} from "./routers/home";
import {employeeRouter} from "./routers/employee";
import {hourRouter} from "./routers/hour";
import {projectRouter} from "./routers/project";
import {handleError} from "./utils/errors";


const app = express();

//z jakiego miejsca rusza nasza apka
app.use(cors({
    origin: config.corsOrigin,
}));

//midelware do rozkodowania jsona express.json()
app.use(json());

//ograniczenia ilościowee wejśc na api
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));

// const router = Router();
//
// router.use('/ad', adRouter);
//
// app.use('/api', router);

//
// app.use(methodOverride('_method')); //metoda z parametrem getowym - zmiani na api prawdziwie restowe
// app.use(urlencoded({
//     extended:true, //korzystamy z wersko rozszerzonej
// })); //do korzystanie z danych wejściowych z formularzy

app.use('/', homeRouter);
app.use('/employee', employeeRouter);
app.use('/hour', hourRouter);
app.use('/project', projectRouter);

app.use(handleError); // obsługa błędów


app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://127.0.0.1:3001');
})