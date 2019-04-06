import axios from "axios";
import {SERVER_URL} from "../shared/constants";
import store from "store";

const serviceProviderHeaders = {
    'Authorization': 'Bearer ' + store.get('serviceProviderToken')
};

var getServiceProviders = function () {
    return axios.get(`${SERVER_URL}/api/serviceProviders`,
        {headers: serviceProviderHeaders}
    )
        .then(response => {
            return response.data.filter(serviceProvider => serviceProvider.serviceProviderId !== 1 && serviceProvider.serviceProviderId !== "1");
        })
        .catch(error => {
            console.log('get serviceProviders error ', error)
        });
};

var getRolesOfServiceProvider = (serviceProviderId) => {
    return axios.get(`${SERVER_URL}/api/serviceProviders/roles/serviceProviderId/${serviceProviderId}`,
        {headers: serviceProviderHeaders}
    )
        .then((response) => {
            let roles = response.data;
            console.log('roles ', roles);
            return roles;
        })
        .catch((error) => {
            console.log('get serviceProvider roles error ', error)
        });
};

var serviceProviderLogin = (userId, password) => {
    return axios.post(`${SERVER_URL}/api/serviceProviders/login/authenticate`,
        {
            "userId": userId,
            "password": password
        },
    );
};

var serviceProviderValidToken = function (token) {
    return axios.post(`${SERVER_URL}/api/serviceProviders/validToken`,
        {
            "token": token
        },
    );
}

var getServiceProviderPermissionsById = (serviceProviderId) => {
    return axios.get(`${SERVER_URL}/api/serviceProviders/serviceProviderId/${serviceProviderId}/permissions`,
        {headers: serviceProviderHeaders}
    )
        .then((response) => {
            let permissions = response.data;
            console.log('permissions ', permissions);
            return permissions;
        })
        .catch((error) => {
            console.log('error ', error);
        });
};

var getServiceProviderById = (serviceProviderId) => {
    return axios.get(`${SERVER_URL}/api/serviceProviders/serviceProviderId/${serviceProviderId}`,
        {headers: serviceProviderHeaders}
    )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log('error ', error);
        });
};


var getServiceProviderAppointmentWayTypeById = (serviceProviderId, role) => {
    return axios.get(`${SERVER_URL}/api/serviceProviders/serviceProviderId/${serviceProviderId}/role/${role}/appointmentWayType`,
        {headers: serviceProviderHeaders}
    )
        .then((response) => {
            let appointmentWayType = response.data[0].appointmentWayType;
            console.log('appointmentWayType ', appointmentWayType);
            return appointmentWayType;
        })
        .catch((error) => {
            console.log('getServiceProviderAppointmentWayTypeById error ', error);
        });
};


var updateServiceProviderById = (serviceProviderId, serviceProviderRole, updateOperationTime = null, updatePhoneNumber = null, updateAppointmentWayType = null, updateSubjects = null, updateActive = null) => {
    let data = {};
    if (updateOperationTime !== null)
        data.operationTime = updateOperationTime;
    if (updatePhoneNumber !== null)
        data.phoneNumber = updatePhoneNumber;
    if (updateAppointmentWayType !== null)
        data.appointmentWayType = updateAppointmentWayType;
    if (updateSubjects !== null)
        data.subjects = updateSubjects;
    if (updateActive !== null)
        data.active = updateActive;

    return axios.put(`${SERVER_URL}/api/serviceProviders/update/serviceProviderId/${serviceProviderId}/role/${serviceProviderRole}`,
        data,
        {
            headers: serviceProviderHeaders
        }
    )
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log('getServiceProviderAppointmentWayTypeById error ', error);
        });
};

var addRoleToServiceProviderById = (serviceProviderId, roleToAdd) => {
    return axios.put(`${SERVER_URL}/api/serviceProviders/roles/addToServiceProvider`,
        {
            serviceProviderId: serviceProviderId,
            role: roleToAdd
        },
        {
            headers: serviceProviderHeaders
        }
    )
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log('addRoleToServiceProviderById error ', error);
        });
};

var removeRoleFromServiceProviderById = (serviceProviderId, roleToRemove) => {
    return axios.put(`${SERVER_URL}/api/serviceProviders/roles/removeFromServiceProvider`,
        {
            serviceProviderId: serviceProviderId,
            role: roleToRemove
        },
        {
            headers: serviceProviderHeaders
        }
    )
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log('removeRoleFromServiceProviderById error ', error);
        });
};

var deleteServiceProviderById = (serviceProviderId, serviceProviderRole, deleteType) => {
    if (deleteType === 'shallowDelete')
        return axios.put(`${SERVER_URL}/api/serviceProviders/update/serviceProviderId/${serviceProviderId}/role/${serviceProviderRole}`,
            {active: false},
            {
                headers: serviceProviderHeaders
            }
        )
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log('deleteServiceProviderById error ', error);
            });
    if (deleteType === 'deepDelete')
        return axios.delete(`${SERVER_URL}/api/serviceProviders/serviceProviderId/${serviceProviderId}`,
            {headers: serviceProviderHeaders}
        )
            .then((response) => {
                let permissions = response.data;
                console.log('permissions ', permissions);
                return permissions;
            })
            .catch((error) => {
                console.log('error ', error);
            });
};

export default {
    getServiceProviders,
    getRolesOfServiceProvider,
    serviceProviderLogin,
    serviceProviderValidToken,
    getServiceProviderPermissionsById,
    getServiceProviderById,
    getServiceProviderAppointmentWayTypeById,
    updateServiceProviderById,
    addRoleToServiceProviderById,
    removeRoleFromServiceProviderById,
    deleteServiceProviderById,
};
