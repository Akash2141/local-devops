import { USER } from "../storage/user";
import { ResponseStatus } from "../types/common";

export function createUser(userDetail: any) {
  USER.push({ ...userDetail, id: USER.length + 1 });
  return {
    result: {
      status: ResponseStatus.SUCCESS,
    },
    code: 200,
  };
}

export function getUsers() {
  return {
    result: {
      users: USER,
    },
    code: 200,
  };
}

export function getUsersById(id: any) {
  return {
    result: USER[0],
    code: 200,
  };
}

export function updateUser() {
  return {
    result: USER[0],
    code: 200,
  };
}

export function deleteUser() {
  return {
    result: USER[0],
    code: 200,
  };
}
