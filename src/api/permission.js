import request from '@/utils/request'
const api = 'permission'
/**
 * 获取权限列表
 *
 * @export
 * @returns
 */
export function allPermissions() {
  return request.get(`${api}/permissionDictionary`)
}

/**
 * 获取当前用户被授予的权限
 *
 * @export
 * @param {*} { user }
 */
export function getPermission({ user }) {
  return request.get(`${api}/permission`, {
    params: { id: user }
  })
}

/**
 *获取当前用户创建的角色和权限
 *
 * @export
 * @param {*} { user }
 * @return {*}
 */
export function getPermissionBy({ user }) {
  return request.get(`${api}/permissionBy`, {
    params: { id: user }
  })
}

/**
 * 为用户赋予角色
 * 方式1：单位主管授权，作为原始角色
 * 方式2：使用现有角色，授权其他用户
 *
 * @export
 * @param {*} { auth, user, role, isRemove }
 * @return {*}
 */
export function relateUserRole({ auth, user, role, isRemove }) {
  return request.post(`${api}/relateUserRole`, {
    data: { auth, user, role, isRemove }
  })
}
export function roleDetail({ role }) {
  return request.get(`${api}/roleDetail`, {
    params: { role }
  })
}

/**
 * 创建/移除/查看角色详情
 *
 * @export
 * @param {*} {
 * auth, 授权
 * role, 作用角色名称
 * isRemove 是否删除当前角色
 * }
 */
export function modifyRole({ auth, role, isRemove }) {
  return request.post(`${api}/role`, { auth, role, isRemove })
}

/**
 * 角色关联权限/角色 主管权限可创建本单位权限 仅角色创建人可修改角色权限
 *
 * @export
 * @param {*} { auth, role, relateRole, permission }
 * @return {*}
 */
export function rolePermission({ auth, role, relateRole, permission }) {
  return request.post(`${api}/rolePermission`, { auth, role, relateRole, permission })
}

/**
 * 检查权限
 *
 * @export
 * @param {*} {
 * user,目标用户
 * permission,目标权限
 * region,单位作用域
 * permissionType,授权类型:0none 1read 2write 3read&write }
 * @return {*}
 */
export function checkPermission({ user, permission, region, permissionType }) {
  return request.post({ user, permission, region, permissionType })
}
