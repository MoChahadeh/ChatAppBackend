import {Router} from 'express';
import authMidWare from '../middleware/auth';


const router = Router();

router.post("/", authMidWare, (req,res) => {

    

})