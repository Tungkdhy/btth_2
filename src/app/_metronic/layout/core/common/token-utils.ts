import { Constant } from 'src/app/core/config/constant';

export const getUserInfo = () => localStorage.getItem('userInfo');

export const setUserInfo = (userInfo: string) => {
  localStorage.setItem('userInfo', userInfo);
};

export const getToken = () => localStorage.getItem('token');

export const setToken = (tokenValue: any) => {
  localStorage.setItem('token', tokenValue);
};

export const getModules = () => localStorage.getItem('modules');

export const getModuleAll = () => localStorage.getItem('moduleAll');

export const setLocalCurrentRole = (roleId: any) => {
  const info = JSON.parse(getUserInfo() + '');
  info.currentRole = roleId;
  setUserInfo(JSON.stringify(info));
};

export const getLocalCurrentRole = () => {
  const info = JSON.parse(getUserInfo() + '');
  return info && info.currentRole ? info.currentRole : null;
};

export const getLocalSubModulePath = () =>
  localStorage.getItem('subModulePath');

export const setLocalSubModulePath = (path: any) =>
  localStorage.setItem('subModulePath', JSON.stringify(path));

export const getStatus = (status: any) => {
  switch (status) {
    case 0:
      return 'Chờ xác nhận';
    case 1:
      return 'Đang thực hiện';
    case 2:
      return 'Từ chối';
    case 3:
      return 'Chờ đánh giá';
    case 4:
      return 'Hoàn thành';
    default:
      return 'Chờ xác nhận';
  }
};

export const setAuthorize = (modulesOfUser: any) => {
  const info = JSON.parse(getUserInfo() + '');
  info.authorize = modulesOfUser;
  setUserInfo(JSON.stringify(info));
};

export const isClericalDocumentOut = () => {
  const modules = JSON.parse(getModules() + '');
  const docIn = modules.find((x: any) => x.code == 'DOCUMENT_IN');
  if (docIn && docIn != null) {
    const docInSub = docIn.subModule;
    const temp = docInSub.find((x: any) => x.code == 'DRAFT_ISSUED');
    if (temp && temp != null) {
      console.log('isClericalDocumentOut TRUE');
      return true;
    }
  }
  console.log('isClericalDocumentOut FALSE');
  return false;
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const checkAuthentication = () => {
  const token = getToken();
  const result = !!token;
  return result;
};

export const setLocalDefaultRole = (roleId: any) => {
  const info = JSON.parse(getUserInfo() + '');
  info.defaultRole = roleId;
  setUserInfo(JSON.stringify(info));
};

export const getLocalDefaultRole = () => {
  const info = JSON.parse(getUserInfo() + '');
  return info.defaultRole;
};

export const getCalendarRegisterTab = () => localStorage.getItem('CalendarTab');

export const setCalendarRegisterTab = (tab: any) =>
  localStorage.setItem('CalendarTab', tab);

export const setDelegateTab = (tab: any) => {
  localStorage.setItem('currentDelegateTab', tab);
};

export const loadDelegateTab = () => localStorage.getItem('currentDelegateTab');

export const removeDelegateTab = () => {
  localStorage.removeItem('currentDelegateTab');
};
