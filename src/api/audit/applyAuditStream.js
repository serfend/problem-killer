import request from '@/utils/request'
const api = '/applyAuditStream'
/**
 * 获取审批节点
 *
 * @export
 * @param {*} name
 * @returns
 */
export function getStreamNode({ name, entityType }) {
  return request.get(`${api}/StreamNode`, {
    params: {
      name,
      entityType
    }
  })
}

/**
 * 获取审批流方案
 *
 * @export
 * @param {*} name
 * @returns
 */
export function getStreamSolution({ name, entityType }) {
  return request.get(`${api}/StreamSolution`, {
    params: {
      name,
      entityType
    }
  })
}

/**
 * 获取审批流方案规则
 *
 * @export
 * @param {*} name
 * @returns
 */
export function getStreamSolutionRule({ name, entityType }) {
  return request.get(`${api}/StreamSolutionRule`, {
    params: {
      name,
      entityType
    }
  })
}

/**
 * MembersFilter ctor.
 *
 * @export
 * @param {Array:String} duties 职务列表
 * @param {Array:String} dutyTags 职务类型列表
 * @param {int} dutyIsMajor 是否为主官 0:Both 1:仅非主官 2:仅主官
 * @param {Array:Company} companies 单位
 * @param {String} companyRefer 单位跳转设置：Parent，Self
 * @param {Array:String} companyTags 单位筛选设置，可以设置为单位的Tag字段
 * @param {Array:int} companyCodeLength 单位筛选设置，可以设置为单位的Code字段长度
 * @param {Array:String} auditMembers 精确表示审核人，设置后前面项失效
 * @param {int} auditMembersCount 需要审核人数量 0表示全部
 * @param {String} entityType 作用应用
 * @returns
 */
export function buildFilter(data) {
  return {
    duties: data.duties.map(i => i.code),
    dutyTags: data.dutyTags,
    dutyIsMajor: data.dutyIsMajor,
    companies: data.companies.map(i => i.code),
    companyRefer: data.companyRefer,
    companyTags: data.companyTags,
    companyCodeLength: data.companyCodeLength,
    auditMembers: data.auditMembers.map(i => i.id),
    auditMembersCount: data.auditMembersCount,
    entityType: data.entityType,
  }
}

/**
 * 新增一个审批节点
 *
 * @export
 * @param {String} name 名称
 * @param {String} description 描述
 * @param {Filter} filter 请调用`buildFilter进行构造`
 * @param {Auth} auth 授权码
 * @returns
 */
export function addStreamNode({ id, name, companyRegion, description, filter, auth }) {
  return request.post(`${api}/StreamNode`, {
    name,
    companyRegion,
    description,
    filter,
    auth
  })
}

/**
 * 新增一个审批节点
 *
 * @export
 * @param {String} id id
 * @param {String} name 名称
 * @param {String} companyRegion 单位作用域
 * @param {String} entityType 单位作用域
 * @param {String} description 描述
 * @param {Filter} filter 请调用`buildFilter进行构造`
 * @param {Auth} auth 授权码
 * @returns
 */
export function editStreamNode({ id, name, companyRegion, entityType, description, filter, auth }) {
  return request.put(`${api}/StreamNode`, {
    id,
    name,
    companyRegion,
    entityType,
    description,
    filter,
    auth
  })
}

/**
 * 创建一个审批流解决方案
 *
 * @export
 * @param {String} name 名称
 * @param {String} companyRegion 单位作用域
 * @param {String} entityType 应用类型
 * @param {String} description 描述
 * @param {Array} nodes 节点名称
 * @param {Auth} auth 授权码
 * @returns
 */
export function addStreamSolution({ id, name, companyRegion, entityType, description, nodes, auth }) {
  return request.post(`${api}/StreamSolution`, {
    name,
    companyRegion,
    entityType,
    description,
    nodes,
    auth
  })
}

/**
 * 编辑一个审批流解决方案
 *
 * @export
 * @param {String} id
 * @param {String} name 名称
 * @param {String} companyRegion 单位作用域
 * @param {String} entityType 应用类型
 * @param {String} description 描述
 * @param {Array} nodes 节点名称
 * @param {Auth} auth 授权码
 * @returns
 */
export function editStreamSolution({ id, name, companyRegion, entityType, description, nodes, auth }) {
  return request.put(`${api}/StreamSolution`, {
    id,
    name,
    entityType,
    companyRegion,
    description,
    nodes,
    auth
  })
}

/**
 * 创建一个匹配规则
 *
 * @export
 * @param {String} name 名称
 * @param {String} companyRegion 单位作用域
 * @param {String} entityType 审批类别/应用名称
 * @param {String} description 描述
 * @param {String} solutionName 规则符合后使用的解决方案
 * @param {Int} priority 优先级
 * @param {Boolean} enable 启用
 * @param {Filter} filter 请调用`buildFilter进行构造`
 * @param {Auth} auth 授权码
 * @returns
 */
export function addStreamSolutionRule({ id, name, companyRegion, entityType, description, solutionName, priority, enable, filter, auth }) {
  return request.post(`${api}/StreamSolutionRule`, {
    name,
    companyRegion,
    entityType,
    description,
    solutionName,
    priority: Number(priority),
    enable,
    filter,
    auth
  })
}

/**
 * 创建一个匹配规则
 *
 * @export
 * @param {String} id
 * @param {String} name 名称
 * @param {String} companyRegion 单位作用域
 * @param {String} entityType 审批类别/应用名称
 * @param {String} description 描述
 * @param {String} solutionName 规则符合后使用的解决方案
 * @param {Int} priority 优先级
 * @param {Boolean} enable 启用
 * @param {Filter} filter 请调用`buildFilter进行构造`
 * @param {Auth} auth 授权码
 * @returns
 */
export function editStreamSolutionRule({ id, name, companyRegion, entityType, description, solutionName, priority, enable, filter, auth }) {
  return request.put(`${api}/StreamSolutionRule`, {
    id,
    name,
    companyRegion,
    entityType,
    description,
    solutionName,
    priority: Number(priority),
    enable,
    filter,
    auth
  })
}

export function queryStreamNode({ companyRegion, entityType }) {
  return request.get(`${api}/StreamNodeQuery`, {
    params: {
      companyRegion,
      entityType
    }
  })
}

export function queryStreamSolution({ companyRegion, entityType }) {
  return request.get(`${api}/StreamSolutionQuery`, {
    params: {
      companyRegion,
      entityType
    }
  })
}

export function queryStreamSolutionRule({ companyRegion, entityType }) {
  return request.get(`${api}/StreamSolutionRuleQuery`, {
    params: {
      companyRegion,
      entityType
    }
  })
}

export function deleteStreamNode({ name, entityType, authByUserid, code }) {
  return request.delete(`${api}/StreamNode`, {
    params: {
      name,
      entityType,
      authByUserid,
      code
    }
  })
}

export function deleteStreamSolution({ name, entityType, authByUserid, code }) {
  return request.delete(`${api}/StreamSolution`, {
    params: {
      name,
      entityType,
      authByUserid,
      code
    }
  })
}

export function deleteStreamSolutionRule({ name, entityType, authByUserid, code }) {
  return request.delete(`${api}/StreamSolutionRule`, {
    params: {
      name,
      entityType,
      authByUserid,
      code
    }
  })
}
