import request from '../utils/request'

export function userinfo(userid) {
  return request.get('/R3/userinfo', {
    params: {
      userid
    }
  })
}

export function giftcodes(userid, pageIndex, pageSize) {
  return request.get('/R3/giftcodes', {
    params: {
      userid, pageIndex, pageSize
    }
  })
}

export function sharecode(userid, code) {
  return request.get('/R3/sharecode', {
    params: {
      userid, code
    }
  })
}

export function handlecode(userid, code) {
  return request.get('/R3/handlecode', {
    params: {
      userid, code
    }
  })
}

export function members(pageIndex, pageSize) {
  return request.get('/R3/members', {
    params: {
      pageIndex, pageSize
    }
  })
}

export function giftCodeHistory(userid, code, pageIndex, pageSize) {
  return request.get('/R3/giftCodeHistory', {
    params: {
      userid, code, pageIndex, pageSize
    }
  })
}

export function updateHandleInterval(userid) {
  return request.get('/R3/updateHandleInterval', {
    params: {
      userid
    }
  })
}
