import { StudentAuth } from "src/Database/mysql";
import { checkEmailOrPhoneExist } from "src/Database/mysql/lib/auth";
import { HttpStatusCodes } from "src/constants/status_codes";
import log from "src/logger";
import { IUser } from "src/models";
import { APIError } from "src/models/lib/api_error";
import { IServiceResponse, ServiceResponse } from "src/models/lib/service_response";

const TAG = 'services.auth'
export async function signupUser(user: IUser) {
    log.info(`${TAG}.signupUser() ==> `, user);
  
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.CREATED, '', false);
    try {
      const existedUser = await checkEmailOrPhoneExist(user.email);
      if(existedUser) {
        serviceResponse.message = 'Email or Mobile is already exist';
        serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
        serviceResponse.addError(new APIError(serviceResponse.message, '', ''));
        return serviceResponse;
      }
      const student = await StudentAuth.signUp(user);
      //TODO send OTP to mobile/ email
    //   const accessToken = await generateOTPToken({ ...user });
      const data = {
        // accessToken,
        student
      }
      serviceResponse.data = data
    } catch (error) {
      log.error(`ERROR occurred in ${TAG}.signupUser`, error);
      serviceResponse.addServerError('Failed to create user due to technical difficulties');
    }
    return serviceResponse;
  }