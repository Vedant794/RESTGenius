import { setData } from '../frontendOutput.js'
import { getJavaZipFile } from '../services/getJavaZip.js'
import {getPannelCode} from '../services/getPannelCode.js'
import {getZipFile} from '../services/getZipFile.js'


export const getCodeForPannel=async(req,res)=>{
    try {
        await getPannelCode(req,res)
    } catch (error) {
        console.error(error)
        res.status(500).send('Unable to fetch getPannelCode due to some reason')
    }
}

export const getCodeAsZip=async(req,res)=>{
    try {
        await getZipFile(req,res)
    } catch (error) {
        console.error(error);
        res.status(500).send('Something Went Wrong please try later..')
    }
}

export const getJavaFolders = async(req,res)=>{
    try {
        await getJavaZipFile(req,res)
    } catch (error) {
        console.error(error);
        res.status(500).send('Something Went Wrong please try later..')
    }
}

export const postFrontend = async (req, res) => {
    try {
        const data = req.body;
        setData(data);
        res.status(200).json({ message: 'Data received and stored successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to store data' });
    }
};


