import {getManager, getRepository} from 'typeorm';
import { User } from '../backend/entity/User';
import { CampaignManager } from '../backend/entity/CampaignManager';
import { Canvasser } from '../backend/entity/Canvasser';
import { TalkPoint } from '../backend/entity/TalkPoint';
import { Questionaire } from '../backend/entity/Questionaire';
import { Locations } from '../backend/entity/Locations';


export const getManagerByUsername = async username => {
    return await getManager().findOne(User, { where: { "_username": username } });
};


export const getManagerByUser = async user => {
    return await getManager().findOne(CampaignManager, { where: { "_ID": user } });
};


export const getCanvasserByUsername = async username => {
    return await getManager().findOne(User, { where: { "_username": username } });
};


export const getCanvasserByUser = async user => {
    return await getManager().findOne(Canvasser, { where: { "_ID": user } });
};


export const deleteTalkPoint = async campaignID => {
    await getRepository(TalkPoint)
        .createQueryBuilder()
        .delete()
        .where("_campaign = :ID", { ID: campaignID })
        .execute();
};


export const deleteQuestionaire = async campaignID => {
    await getRepository(Questionaire)
        .createQueryBuilder()
        .delete()
        .where("_campaign = :ID", { ID: campaignID })
        .execute();
};


export const getCanvasserCamp = async campaignID => {
    return await getManager()
        .createQueryBuilder(Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._ID", "user")
        .where("campaign._ID = :ID", { ID: campaignID })
        .getMany();
};


export const removeCanvasserCampaign = async (employeeID, campaignID) => {
    await getManager()
        .createQueryBuilder()
        .relation(Canvasser, "_campaigns")
        .of(employeeID)
        .remove(campaignID)
        .catch(e => console.log(e))
};


export const deleteLocation = async locationID => {
    await getManager()
        .createQueryBuilder()
        .delete()
        .from(Locations)
        .where("_ID = :id", {id: locationID})
        .execute()
        .then(res => console.log(res))
        .catch(e => console.log(e))  
};