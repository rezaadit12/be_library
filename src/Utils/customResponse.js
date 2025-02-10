export const fetchAllDataSuccess = (message, total_data, data) => {
    return {
        success: true,
        message: message,
        total_data: total_data,
        data: data,
    }
}

export const dataSuccessResponse = (message, data) => {
    return {
        success: true,
        message: message,
        data: data,
    }
}

export const dataFailedResponse = (message) => {
    return {
        success: false,
        message: message,
    }
}