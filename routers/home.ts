import {Router} from "express";

export const homeRouter = Router();

homeRouter
    //tu nie muszą być otypowane, ponieważ to tylko collbac który nie jest wykorzystywany na zwenątrz funkcji
.get('/', (req, res) => {
    // res.render('home/home');
    console.log('jestem');
})