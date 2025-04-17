import M_staff from "../Models/M_staff.js";
import { fetchAllDataSuccess, dataSuccessResponse, dataFailedResponse } from "../Utils/customResponse.js";

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
        const staff = await M_staff.findById(id);
        if(!staff){
            return res.status(404).json(dataFailedResponse('staff not found!'))
        }
        return res.json(dataSuccessResponse('Get staff by ID successfully', staff));
    } catch (error) {
        return res.status(500).json(dataFailedResponse(error.message));
    }
}

