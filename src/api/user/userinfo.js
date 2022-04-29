import request from '@/utils/request'
import { cached_data } from '@/utils/cache'
const api = 'users'
const urlGetUserSummary = `${api}/summary`
/**
 * 获取用户摘要信息
 *
 * @export
 * @param {*} id
 * @param {*} ignoreErr 是否忽略错误
 * @returns
 */
export function getUserSummary(id, ignoreErr) {
  const action = () =>
    request.get(urlGetUserSummary, {
      params: {
        id
      },
      ignoreError: ignoreErr
    })

  return id ? cached_data(`${urlGetUserSummary}/${id}`, action
  ) : action()
}
const urlGetUserBase = `${api}/base`
/**
 * 基础信息
 * @description > ``` response
   {
    Id:"",//用户唯一标识号，可为身份号或身份证号,
    RealName:"姓名",
    Company:"单位名称",//后续可能拓展为单位基础信息,
    职务:"职务名称",
  }
  ```
 */
export function getUserBase(id, ignoreErr) {
  return cached_data(`${urlGetUserBase}/${id}`, () =>
    request.get(urlGetUserBase, {
      params: {
        id
      },
      ignoreError: ignoreErr
    })
  )
}

export function getUserDiy(id, ignoreErr) {
  return request.get('users/diyinfo', {
    params: {
      id
    },
    ignoreError: ignoreErr
  })
}
/**
 * 社会关系 Get /Users/social
 * @description
 ```
 {
    Home:{//家庭
        zipCode://邮编
        Address://详细地址
    },
    Phone:联系方式
}
```
 */
export function getUserSocial(id, ignoreErr) {
  return request.get('users/social', {
    params: {
      id
    },
    ignoreError: ignoreErr
  })
}

/**
 * 职务信息 Get /Users/duties
 * @description
 ```
 {
    id:101
    Name:"干事"
 }
```
 */
export function getUserDuties(id, ignoreErr) {
  return request.get('users/duties', {
    params: {
      id
    },
    ignoreError: ignoreErr
  })
}

/**
 * 获取用户系统信息
 *
 * @export
 * @param {*} id
 * @returns
 */
export function getUserApplication(id, ignoreErr) {
  return request.get('users/application', {
    params: {
      id
    },
    ignoreError: ignoreErr
  })
}

/**
 * 单位信息 Get /Users/company
 * @description
 ```
  {
      Company:{
          Name:"单位名称",
        Code:"ADJC1A22",
        Parent:"上级单位名称"
      },
      Duties:"职务名称"
  }
 ```
 */
export function getUserCompany(id, ignoreErr) {
  return request.get('users/company', {
    params: {
      id
    },
    ignoreError: ignoreErr
  })
}

/**
 *通过身份证号查询身份号
 *
 * @export
 * @param {*} cid
 * @param {*} ignoreErr 是否忽略错误
 * @returns
 */
export function getUserIdByCid(cid, ignoreErr) {
  return request.get('/account/GetUserIdByCid', {
    params: {
      cid
    },
    ignoreError: ignoreErr
  })
}

/**
 *通过真实姓名查询身份号
 *
 * @export
 * @param {String} realName
 * @param {int} pageIndex
 * @param {int} pageSize
 * @param {Boolean} ignoreErr
 * @param {Boolean} fuzz
 * @returns
 */
export function getUserIdByRealName({ realName, pageIndex, pageSize, ignoreErr, fuzz }) {
  return request.get('/account/GetUserIdByRealName', {
    params: {
      realName,
      pageIndex,
      pageSize,
      fuzz
    },
    ignoreError: ignoreErr
  })
}
const url_getUsersVacationLimit = `${api}/vacation`
/**
 * 获取用户休假限制时长和次数
 * @param {*} userid 用户名
 * @param {*} vacationYear 休假年度
 */
export function getUsersVacationLimit({ userid, vacationYear, isPlan, ignoreErr }) {
  return cached_data(`${url_getUsersVacationLimit}/${userid}/${vacationYear}/${isPlan}`, () =>
    request.get(url_getUsersVacationLimit, {
      params: {
        id: userid,
        vacationYear,
        isPlan
      },
      ignoreError: ignoreErr
    })
  )
}
const url_getUserAvatar = `${api}/avatar`
/**
 * 获取用户头像
 *
 * @export
 * @param {string} id 用户id，默认为当前用户
 * @param {guid} avatarId 头像id，默认为null
 * @returns
 */
export function getUserAvatar(id, avatarId, ignoreErr) {
  return cached_data(`${url_getUserAvatar}/${id}/${avatarId}`, () =>
    request.get(url_getUserAvatar, {
      params: {
        userId: id,
        avatarId
      },
      ignoreError: ignoreErr
    })
  )
}
/**
 *修改用户头像
 *
 * @export
 * @param {*} newAvatar
 * @returns
 */
export function postUserAvatar(newAvatar, ignoreErr) {
  return request.post('/users/avatar', {
    url: newAvatar
  }, {
    ignoreError: ignoreErr
  })
}

/**
 * 修改用户单位
 *
 * @export
 * @param {Array} modifies {
 *  userid 目标用户id或数组
 *  companyType 单位类型
 *  targetCompany 目标单位
 * }
 * @param {Object} auth 授权
 */
export function postUserCompany(modifies, auth) {
  return request.post('/users/usersCompany', {
    auth,
    data: modifies
  })
}
