import M_staff from "../Models/M_staff.js";
import { fetchAllDataSuccess, dataSuccessResponse, dataFailedResponse } from "../Utils/customResponse.js";
import argon2 from "argon2";

export const getAllStaff = async (req, res) => {
    try{
        const staff = await M_staff.find();
        return res.json(fetchAllDataSuccess('Get all staff successfully', staff.length, staff ));
    }catch(error){
        return res.status(500).json(dataFailedResponse(error.message));
    }
}

export const getStaffById = async (req, res) => {
    const { id } = req.params;
    try {
        const staff = await M_staff.exists({_id: id});
        if(!staff){
            return res.status(404).json(dataFailedResponse('staff not found!'))
        }
        return res.json(dataSuccessResponse('Get staff by ID successfully', staff));
    } catch (error) {
        return res.status(500).json(dataFailedResponse(error.message));
    }
}

export const createNewStaff = async (req, res) => {
    let data = req.body;
    try {
        const duplicate = await M_staff.findOne({email: data.email}, 'id');
        if(duplicate){
            return res.status(400).json(dataFailedResponse('Data staff already exists!'));
        }

        data.password = await argon2.hash(data.password);

        const createNewStaff = await M_staff.create(data);
        return res.status(201).json(dataSuccessResponse('Staff created successfully', createNewStaff));

    } catch (error) {
        return res.status(500).json(dataFailedResponse(error.message));
    }
}

export const updateStaff = async(req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const staff = await M_staff.exists({_id: id});
        if(!staff) return res.status(400).json(dataFailedResponse('staff not found'));

        if(data.password){
            data.password = await argon2.hash(data.password);
        }

        await M_staff.updateOne({_id: id}, {$set: data});

        return res.status(200).json(dataSuccessResponse("staff updated successfully", req.body));
    } catch (error) {
        console.log(error);
        return res.status(500).json(dataFailedResponse(error.message));
    }
}

export const deleteStaff = async(req, res) => {
    const { id } = req.params;
    try {
        const staff = await M_staff.exists({_id: id});
        if(!staff) return res.status(400).json(dataFailedResponse('staff not found'));

        const deleteStaff = await M_staff.deleteOne({_id: id});
        return res.status(200).json(dataSuccessResponse("staff deleted successfully", deleteStaff));
    } catch (error) {
        console.log(error);
        return res.status(500).json(dataFailedResponse(error.message));
    }
}