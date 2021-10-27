import {Request, Response} from "express";
import dotenv from 'dotenv';
import * as redis from 'redis';
import {promisify} from 'util';

dotenv.config();
const REDIS_HOST = process.env.REDISHOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDISPORT || '6379');
const redisClient = redis.createClient(REDIS_PORT, REDIS_HOST);
redisClient.on('error', err => console.error('ERR:REDIS:', err));
const incrAsync: (string) => Promise<number> = promisify(redisClient.incr).bind(redisClient);
const expireAsync: (string, number) => Promise<number> = promisify(redisClient.expire).bind(redisClient);

exports.createRace = async (req: Request, res: Response) => {
    try {
        const response = await incrAsync('visits');
        await expireAsync('visits', 3600); // visits get reset after 1 hr idle
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(`Visit count: ${response}`);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};
