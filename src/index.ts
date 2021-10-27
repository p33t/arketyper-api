import {Request, Response} from "express";

exports.createRace = (req: Request, resp: Response) => {
    resp.send('Hello');
};
